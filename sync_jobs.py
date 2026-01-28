import json
import os
import csv
from dotenv import load_dotenv
from db_client_template import DBClient

# Load environment variables (expecting .env in the same dir)
load_dotenv()

OUTPUT_FILE = "src/data/jobs.json"
STATION_CSV_FILE = "station20251211free.csv"

# --- Configuration & Constants (Ported from merge_jobs.py) ---
FILTER_TARGET_SOURCES = ["Indeed", "Kyujinbox"]
REQUIRED_KEYWORDS = ["未経験", "初心者"]
NG_KEYWORDS = [
    "軽作業", "倉庫", "仕分け", "ピッキング", "梱包", 
    "ホール", "キッチン", "調理", "清掃", "警備", 
    "コンビニ", "レジ", "ドライバー", "配送", "配達", 
    "工場", "製造", "ライン作業", "パチンコ", "カラオケ",
    "引越", "施工管理", "看護師", "薬剤師", "介護"
]

PREF_CODE_MAP = {
    1: "北海道", 2: "青森県", 3: "岩手県", 4: "宮城県", 5: "秋田県", 6: "山形県", 7: "福島県",
    8: "茨城県", 9: "栃木県", 10: "群馬県", 11: "埼玉県", 12: "千葉県", 13: "東京都", 14: "神奈川県",
    15: "新潟県", 16: "富山県", 17: "石川県", 18: "福井県", 19: "山梨県", 20: "長野県",
    21: "岐阜県", 22: "静岡県", 23: "愛知県", 24: "三重県", 25: "滋賀県", 26: "京都府", 27: "大阪府",
    28: "兵庫県", 29: "奈良県", 30: "和歌山県", 31: "鳥取県", 32: "島根県", 33: "岡山県", 34: "広島県",
    35: "山口県", 36: "徳島県", 37: "香川県", 38: "愛媛県", 39: "高知県", 40: "福岡県",
    41: "佐賀県", 42: "長崎県", 43: "熊本県", 44: "大分県", 45: "宮崎県", 46: "鹿児島県", 47: "沖縄県"
}

PREF_PRIORITY = [
    "東京都", "大阪府", "神奈川県", "京都府", "愛知県", "福岡県", "北海道", "兵庫県", "埼玉県", "千葉県"
]

STATION_PREF_MAP = {}

# --- Geographic Helpers ---

def load_station_data(csv_path):
    global STATION_PREF_MAP
    try:
        if not os.path.exists(csv_path):
             # Try absolute path if relative fails (assuming script is in R-website root)
             csv_path = os.path.join(os.path.dirname(__file__), csv_path)

        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                name = row['station_name']
                pref_cd = int(row['pref_cd'])
                pref_name = PREF_CODE_MAP.get(pref_cd)
                if pref_name:
                    if name not in STATION_PREF_MAP:
                        STATION_PREF_MAP[name] = set()
                    STATION_PREF_MAP[name].add(pref_name)
                    count += 1
            print(f"✅ Loaded {count} stations from CSV.")
    except Exception as e:
        print(f"⚠️ Station CSV loading error: {e}")
        STATION_PREF_MAP = {}

def detect_prefecture(location):
    if not location or location == "N/A":
        return None
    
    # 1. Direct Match
    for code, pref in PREF_CODE_MAP.items():
        if pref in location:
            return pref
            
    # 2. Key/Station Match
    possible_prefs = set()
    for station, prefs in STATION_PREF_MAP.items():
        if len(station) < 2: 
            continue
        if station in location:
            possible_prefs.update(prefs)

    if not possible_prefs:
        return None
        
    for p in PREF_PRIORITY:
        if p in possible_prefs:
            return p
            
    return list(possible_prefs)[0]

# --- Filtering Logic ---

def is_valid_job(job):
    # Only filter specific sources if needed (Currently filtering Indeed/Kyujinbox based on keyword rules)
    # The requirement is to generally apply these valid filters to ensure quality.
    
    source = job.get('site_name') or job.get('source')
    # If the job explicitly comes from a source we want to be strict about:
    if source in FILTER_TARGET_SOURCES:
        pass # proceed to check
    else:
        # For Infra/ZeroOne, assume they are generally valid or apply same rules?
        # Let's apply the 'NG Keyword' rule to ALL, but 'Required Keyword' only to generic search engines.
        # But for now, sticking to merge_jobs.py logic:
        # "if job.get('source') not in FILTER_TARGET_SOURCES: return True"
        pass

    if source not in FILTER_TARGET_SOURCES:
        return True

    title = str(job.get('title', ''))
    summary = str(job.get('summary', ''))
    full_text = (title + summary).replace("\n", "").replace(" ", "")
    
    # 1. Required Keywords
    if not any(req in full_text for req in REQUIRED_KEYWORDS):
        return False
        
    # 2. NG Keywords
    if any(ng in full_text for ng in NG_KEYWORDS):
        return False
        
    return True

# --- Main Sync Logic ---

def main():
    print("🚀 Starting Sync Jobs from Supabase...")
    
    # Initialize DB
    try:
        db = DBClient()
    except Exception as e:
        print(f"❌ Failed to init DB: {e}")
        return

    # 1. Cleanup Old Jobs (Older than 30 days)
    print("🧹 Cleaning up old jobs...")
    deleted_count = db.delete_old_jobs(days=30)
    print(f"   -> Deleted {deleted_count} old jobs.")

    # 2. Load Station Data for normalization
    load_station_data(STATION_CSV_FILE)

    # 3. Fetch All Jobs (Sorted by Created At DESC)
    print("📥 Fetching latest jobs from DB...")
    raw_jobs = db.fetch_all_jobs()
    print(f"   -> Fetched {len(raw_jobs)} jobs.")

    # 4. Process & Format
    valid_jobs_list = []
    
    for job in raw_jobs:
        # Standardize 'source' key (DB uses 'site_name', Frontend expects 'source' or handles both?)
        # page.tsx defines type Job with optional 'source'.
        # manual says DB has 'site_name'.
        job['source'] = job.get('site_name')
        
        # Filter
        if is_valid_job(job):
            # Normalize Location
            loc = job.get('location', '')
            detect_pref = detect_prefecture(loc)
            
            if detect_pref:
                job['prefecture'] = detect_pref
                if detect_pref not in loc:
                    job['location'] = f"{detect_pref} {loc}"
            
            # Map 'link' to 'url' because frontend might use 'link' (Job type says 'link: string | null')
            if not job.get('link') and job.get('url'):
                job['link'] = job['url']

            valid_jobs_list.append(job)

    print(f"✅ Processing complete. {len(valid_jobs_list)} jobs valid after filtering.")

    # 5. Write to JSON
    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(valid_jobs_list, f, indent=2, ensure_ascii=False)
        
    print(f"🎉 Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
