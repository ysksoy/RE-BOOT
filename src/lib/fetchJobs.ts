import { supabase } from "./supabase";

export type Job = {
    id?: string;
    title: string;
    company: string;
    location: string;
    salary: string | null;
    summary: string | null;
    link: string | null;
    url?: string | null;
    prefecture?: string;
    source?: string;
    site_name?: string;
    image_url?: string | null;
    recommendation?: string | null;
    tags?: string[];
};

// sync_jobs.py の EXPORT_SOURCES に相当
const EXPORT_SOURCES = ["Infra", "ZeroOne"];

// 都道府県コードマップ
const PREF_CODE_MAP: Record<number, string> = {
    1: "北海道", 2: "青森県", 3: "岩手県", 4: "宮城県", 5: "秋田県", 6: "山形県", 7: "福島県",
    8: "茨城県", 9: "栃木県", 10: "群馬県", 11: "埼玉県", 12: "千葉県", 13: "東京都", 14: "神奈川県",
    15: "新潟県", 16: "富山県", 17: "石川県", 18: "福井県", 19: "山梨県", 20: "長野県",
    21: "岐阜県", 22: "静岡県", 23: "愛知県", 24: "三重県", 25: "滋賀県", 26: "京都府", 27: "大阪府",
    28: "兵庫県", 29: "奈良県", 30: "和歌山県", 31: "鳥取県", 32: "島根県", 33: "岡山県", 34: "広島県",
    35: "山口県", 36: "徳島県", 37: "香川県", 38: "愛媛県", 39: "高知県", 40: "福岡県",
    41: "佐賀県", 42: "長崎県", 43: "熊本県", 44: "大分県", 45: "宮崎県", 46: "鹿児島県", 47: "沖縄県",
};

const PREF_NAMES = Object.values(PREF_CODE_MAP);

function detectPrefecture(location: string | null): string | undefined {
    if (!location) return undefined;
    for (const pref of PREF_NAMES) {
        if (location.includes(pref)) return pref;
    }
    return undefined;
}

function processJob(job: Job): Job {
    const source = job.site_name || job.source;
    const processed = { ...job, source };

    // link が無く url があれば link にコピー
    if (!processed.link && processed.url) {
        processed.link = processed.url;
    }

    // 都道府県を検出
    const pref = detectPrefecture(processed.location);
    if (pref) {
        processed.prefecture = pref;
        if (!processed.location?.includes(pref)) {
            processed.location = `${pref} ${processed.location}`;
        }
    }

    return processed;
}

/**
 * Supabaseから求人データを取得し、フィルタリング・整形して返す
 * sync_jobs.py と同等のロジック
 */
export async function fetchJobs(): Promise<Job[]> {
    const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .in("site_name", EXPORT_SOURCES)
        .order("created_at", { ascending: false })
        .limit(2000);

    if (error) {
        console.error("Supabase fetch error:", error);
        return [];
    }

    return (data || []).map(processJob);
}

/**
 * IDで1件の求人を取得する
 */
export async function fetchJobById(id: string): Promise<Job | null> {
    const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) return null;
    return processJob(data as Job);
}
