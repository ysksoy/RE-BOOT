import json
import glob
import os
import hashlib
from datetime import datetime

# 各プロジェクトの出力ディレクトリパス
PROJECT_PATHS = {
    "Infra": "../infra-scraping/output/*.json",
    "ZeroOne": "../zeroone-scraping/output/*.json",
    "Indeed": "../indeed-scraping/output/*.json",
    "Kyujinbox": "../kyujin-scraping/output/*.json"
}

OUTPUT_FILE = "src/data/jobs.json"

def get_latest_file(pattern):
    files = glob.glob(pattern)
    if not files:
        return None
    # 作成日時（またはファイル名の日付）でソートして最新を取得
    return max(files, key=os.path.getctime)

# フィルタリング設定
FILTER_TARGET_SOURCES = ["Indeed", "Kyujinbox"]

# 必須キーワード（いずれかが含まれていればOK）
REQUIRED_KEYWORDS = ["未経験", "初心者"]

# NGキーワード（いずれかが含まれていれば除外）
NG_KEYWORDS = [
    "軽作業", "倉庫", "仕分け", "ピッキング", "梱包", 
    "ホール", "キッチン", "調理", "清掃", "警備", 
    "コンビニ", "レジ", "ドライバー", "配送", "配達", 
    "工場", "製造", "ライン作業", "パチンコ", "カラオケ",
    "引越", "施工管理", "看護師", "薬剤師", "介護"
]

import csv

# JIS都道府県コード (1-47)
PREF_CODE_MAP = {
    1: "北海道", 2: "青森県", 3: "岩手県", 4: "宮城県", 5: "秋田県", 6: "山形県", 7: "福島県",
    8: "茨城県", 9: "栃木県", 10: "群馬県", 11: "埼玉県", 12: "千葉県", 13: "東京都", 14: "神奈川県",
    15: "新潟県", 16: "富山県", 17: "石川県", 18: "福井県", 19: "山梨県", 20: "長野県",
    21: "岐阜県", 22: "静岡県", 23: "愛知県", 24: "三重県", 25: "滋賀県", 26: "京都府", 27: "大阪府",
    28: "兵庫県", 29: "奈良県", 30: "和歌山県", 31: "鳥取県", 32: "島根県", 33: "岡山県", 34: "広島県",
    35: "山口県", 36: "徳島県", 37: "香川県", 38: "愛媛県", 39: "高知県", 40: "福岡県",
    41: "佐賀県", 42: "長崎県", 43: "熊本県", 44: "大分県", 45: "宮崎県", 46: "鹿児島県", 47: "沖縄県"
}

# 優先順位（同名の駅がある場合、この順序で判定する）
PREF_PRIORITY = [
    "東京都", "大阪府", "神奈川県", "京都府", "愛知県", "福岡県", "北海道", "兵庫県", "埼玉県", "千葉県"
]

STATION_PREF_MAP = {}

def load_station_data(csv_path="station20251211free.csv"):
    """
    CSVから駅データを読み込み、{駅名: [都道府県リスト]} のマップを作成する
    """
    global STATION_PREF_MAP
    try:
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
    except FileNotFoundError:
        print("⚠️ Station CSV not found. Using fallback detection.")
        STATION_PREF_MAP = {}

def detect_prefecture(location):
    if not location or location == "N/A":
        return None
        
    # 1. 直接都道府県名が含まれているかチェック（最優先・最強）
    for code, pref in PREF_CODE_MAP.items():
        if pref in location:
            return pref
            
    # 2. 駅名からの逆引き
    # loc文字列に含まれる駅名を全て探し、候補の都道府県を挙げる
    candidates = []
    
    # 駅名の検索（長い順にマッチさせるのが理想だが、ここでは簡易的に）
    # 文字列検索は重いので、location内の単語を切り出すか、
    # 逆にlocationに対して駅名リストを走査する
    # 今回は精度重視で、STATION_PREF_MAPのキーを走査する（少し遅いかもだが、件数少ないのでOK）
    
    # 高速化のため、locationに含まれそうな文字数でフィルターも考えられるが、
    # シンプルに「3文字以上の駅名」あるいは「〇〇駅」という形式を探すのが良い
    # しかし「五反田」のように「駅」がつかない場合もある。
    
    # 戦略: locationに含まれる文字列と駅名のマッチング
    possible_prefs = set()
    
    # locationが長い場合、全駅ループは厳しいか？
    # -> 駅データは1万件程度。100件の求人に対してなら 100 x 10000 = 100万回比較。Pythonなら数秒。
    
    for station, prefs in STATION_PREF_MAP.items():
        # 誤爆防止: 2文字以上の駅名に限定、かつ一般的な単語（「大学」「公園」など）を除外する必要があるかも
        # 今回は一旦そのまま。ただし「駅」がついていないと誤爆しやすい（例: "本町"）
        if len(station) < 2: 
            continue
            
        # 安全策: "駅" が後ろについているか、あるいは特定の主要駅リストに含まれるか
        # location = "五反田駅徒歩5分" -> hit "五反田"
        if station in location:
            possible_prefs.update(prefs)

    if not possible_prefs:
        return None
        
    # 候補の中から優先順位の高いものを返す
    for p in PREF_PRIORITY:
        if p in possible_prefs:
            return p
            
    # 優先リストになければ、候補の最初の一つを返す
    return list(possible_prefs)[0]


def is_valid_job(job):
    # 特定のソースのみフィルタリング対象
    if job.get('source') not in FILTER_TARGET_SOURCES:
        return True
        
    title = str(job.get('title', ''))
    summary = str(job.get('summary', ''))
    full_text = (title + summary).replace("\n", "").replace(" ", "")
    
    # 1. 必須キーワードチェック (ポジティブフィルタ)
    if not any(req in full_text for req in REQUIRED_KEYWORDS):
        return False
        
    # 2. NGキーワードチェック (ネガティブフィルタ)
    if any(ng in full_text for ng in NG_KEYWORDS):
        return False
        
    return True

def main():
    # 駅データの読み込み
    load_station_data()

    combined_jobs = []
    
    print("🚀 Merging Job Data with Filters & Normalization...")
    
    for source, pattern in PROJECT_PATHS.items():
        latest_file = get_latest_file(pattern)
        if latest_file:
            print(f"✅ Found {source}: {latest_file}")
            try:
                with open(latest_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    jobs = data.get('jobs', []) if isinstance(data, dict) else data
                    
                    count_before = len(jobs)
                    valid_jobs = []
                    
                    for job in jobs:
                        if 'source' not in job:
                            job['source'] = source
                        
                        # フィルタリング
                        if is_valid_job(job):
                            # 都道府県補完ロジック
                            loc = job.get('location', '')
                            detected_pref = detect_prefecture(loc)
                            
                            if detected_pref:
                                job['prefecture'] = detected_pref
                                # locationに都道府県が含まれていなければ先頭に付与
                                if detected_pref not in loc:
                                    job['location'] = f"{detected_pref} {loc}"
                            
                            valid_jobs.append(job)
                            
                    combined_jobs.extend(valid_jobs)
                    
                    filtered_count = count_before - len(valid_jobs)
                    print(f"   -> Added {len(valid_jobs)} jobs (Filtered out {filtered_count} noise jobs)")
                    
            except Exception as e:
                print(f"   ❌ Error reading {latest_file}: {e}")
        else:
            print(f"⚠️ No data found for {source}")

    # 重複排除（念のためリンクをキーに）
    unique_jobs = {job['link']: job for job in combined_jobs if job.get('link')}
    final_list = list(unique_jobs.values())

    # ID付与 (リンクのハッシュ値)
    for job in final_list:
        if 'link' in job:
            job['id'] = hashlib.md5(job['link'].encode('utf-8')).hexdigest()
    
    # 保存ディレクトリ作成
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, indent=2, ensure_ascii=False)
        
    print("\n" + "="*30)
    print(f"🎉 Successfully merged {len(final_list)} jobs into {OUTPUT_FILE}")
    print("="*30)

if __name__ == "__main__":
    main()
