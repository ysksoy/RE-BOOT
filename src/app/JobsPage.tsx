"use client";

import { useState } from "react";
import { Search, MapPin, Building2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCategory } from "@/lib/jobUtils";
import type { Job } from "@/lib/fetchJobs";

export default function JobsPage({ jobs }: { jobs: Job[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("すべて");

    // Master Data
    const categories = ["すべて", "エンジニア", "デザイナー", "営業", "企画", "マーケティング", "編集/ライター", "その他"];

    const areas = [
        { name: "すべて", id: "all" },
        {
            name: "東京都", id: "tokyo", children: [
                { name: "渋谷", id: "shibuya" },
                { name: "新宿", id: "shinjuku" },
                { name: "六本木・港区", id: "roppongi_minato" },
                { name: "東京・丸の内", id: "tokyo_marunouchi" },
                { name: "品川", id: "shinagawa" },
            ]
        },
        { name: "神奈川県", id: "kanagawa" },
        {
            name: "関西", id: "kansai", children: [
                { name: "大阪府", id: "osaka" },
                { name: "京都府", id: "kyoto" },
            ]
        },
        { name: "その他（国内）", id: "other_jp" },
    ];

    const TOKYO_KEYWORDS = [
        "東京都", "東京", "千代田区", "中央区", "港区", "新宿", "文京区", "台東区", "墨田区", "江東区", "品川", "目黒", "大田区", "世田谷", "渋谷", "中野", "杉並区", "豊島区", "北区", "荒川区", "板橋区", "練馬区", "足立区", "葛飾区", "江戸川区",
        "八王子", "立川", "武蔵野", "三鷹", "青梅", "府中", "昭島", "調布", "町田", "小金井", "小平", "日野", "東村山", "国分寺", "国立", "福生", "狛江", "東大和", "清瀬", "東久留米", "武蔵村山", "多摩", "稲城", "羽村", "あきる野", "西東京",
        "銀座", "六本木", "赤坂", "青山", "原宿", "表参道", "代官山", "恵比寿", "五反田", "大崎", "上野", "秋葉原", "神田", "御茶ノ水", "水道橋", "飯田橋", "神楽坂", "高田馬場", "池袋", "新橋", "浜松町", "田町", "有楽町", "日比谷", "日本橋", "大手町", "丸の内"
    ];
    const KANAGAWA_KEYWORDS = ["神奈川", "横浜", "川崎", "相模原", "横須賀", "平塚", "鎌倉", "藤沢", "小田原", "茅ヶ崎", "逗子", "三浦", "秦野", "厚木", "大和", "伊勢原", "海老名", "座間", "南足柄", "綾瀬", "みなとみらい", "桜木町", "関内"];
    const OSAKA_KEYWORDS = ["大阪", "梅田", "難波", "心斎橋", "天王寺", "京橋", "淀屋橋", "本町", "新大阪", "北新地", "堺", "豊中", "池田", "吹田", "高槻", "守口", "枚方", "茨木", "八尾", "寝屋川", "大東", "箕面", "門真", "摂津", "高石", "藤井寺", "東大阪", "泉南", "四條畷", "交野"];
    const KYOTO_KEYWORDS = ["京都", "四条", "烏丸", "河原町", "祇園", "嵐山", "伏見", "宇治", "亀岡", "舞鶴", "宮津", "城陽", "向日", "長岡京", "八幡", "京田辺", "木津川"];

    const industries = [
        "すべて", "IT", "VC/起業支援", "ゲーム", "コンサルティング", "スポーツ", "ファッション/アパレル", "ブライダル", "メーカー", "メディア", "教育", "金融", "広告", "商社", "人材", "医療", "農業", "不動産", "士業", "旅行/レジャー/エンタメ", "食", "官公庁", "その他"
    ];

    const features = [
        "週3日以下でもOK", "週4日以上歓迎", "1ヶ月からOK", "フルリモート可", "一部リモート可", "1・2年生歓迎", "3年生歓迎", "4年生歓迎"
    ];

    // Check Logic (Same as before)
    const checkArea = (job: Job, areaId: string): boolean => {
        if (areaId === "all") return true;
        if (areaId === "tokyo" && job.prefecture === "東京都") return true;
        if (areaId === "kanagawa" && job.prefecture === "神奈川県") return true;
        if (areaId === "osaka" && job.prefecture === "大阪府") return true;
        if (areaId === "kyoto" && job.prefecture === "京都府") return true;
        if (areaId === "kansai" && ["大阪府", "京都府", "兵庫県", "奈良県", "滋賀県", "和歌山県"].includes(job.prefecture || "")) return true;

        const loc = job.location || "";
        if (!loc) return false;
        const matches = (keywords: string[]) => keywords.some(k => loc.includes(k));

        if (areaId === "tokyo") return matches(TOKYO_KEYWORDS);
        if (areaId === "shibuya") return loc.includes("渋谷");
        if (areaId === "shinjuku") return loc.includes("新宿");
        if (areaId === "roppongi_minato") return loc.includes("港区") || loc.includes("六本木");
        if (areaId === "tokyo_marunouchi") return loc.includes("千代田区") || loc.includes("丸の内") || loc.includes("東京") || loc.includes("大手町") || loc.includes("日比谷");
        if (areaId === "shinagawa") return loc.includes("品川") || loc.includes("五反田") || loc.includes("大崎");
        if (areaId === "kanagawa") return matches(KANAGAWA_KEYWORDS);

        const isKyoto = !loc.includes("東京都") && matches(KYOTO_KEYWORDS);
        const isKansai = matches(OSAKA_KEYWORDS) || isKyoto || loc.includes("兵庫") || loc.includes("神戸") || loc.includes("滋賀") || loc.includes("奈良") || loc.includes("和歌山");

        if (areaId === "kansai") return isKansai;
        if (areaId === "osaka") return matches(OSAKA_KEYWORDS);
        if (areaId === "kyoto") return isKyoto;

        if (areaId === "other_jp") {
            if (job.prefecture && !["東京都", "神奈川県", "大阪府", "京都府", "兵庫県"].includes(job.prefecture)) return true;
            return !matches(TOKYO_KEYWORDS) && !matches(KANAGAWA_KEYWORDS) &&
                !matches(OSAKA_KEYWORDS) && !matches(KYOTO_KEYWORDS) &&
                !loc.includes("兵庫") && !loc.includes("神戸");
        }
        return false;
    };

    const checkFeature = (job: Job, features: string[]) => {
        if (features.length === 0) return true;
        return features.every(feature => {
            const text = (job.title + (job.summary || "")).toLowerCase();
            if (feature === "週3日以下でもOK") return text.includes("週1") || text.includes("週2") || text.includes("週3");
            if (feature === "週4日以上歓迎") return text.includes("週4") || text.includes("週5") || text.includes("フルタイム");
            if (feature === "1ヶ月からOK") return text.includes("短期") || text.includes("1ヶ月") || text.includes("単発");
            if (feature === "フルリモート可") return text.includes("フルリモート") || text.includes("完全在宅");
            if (feature === "一部リモート可") return (text.includes("リモート") || text.includes("在宅")) && !text.includes("完全在宅") && !text.includes("フルリモート");
            if (feature === "1・2年生歓迎") return text.includes("1年") || text.includes("2年") || text.includes("低学年");
            if (feature === "3年生歓迎") return text.includes("3年");
            if (feature === "4年生歓迎") return text.includes("4年");
            return false;
        });
    };

    const checkIndustry = (job: Job, industry: string) => {
        if (industry === "すべて") return true;
        const text = (job.title + (job.summary || "") + job.company).toLowerCase();
        if (industry === "IT") return text.includes("it") || text.includes("web") || text.includes("アプリ") || text.includes("システム") || text.includes("テック") || text.includes("テクノロジー");
        if (industry === "VC/起業支援") return text.includes("vc") || text.includes("ベンチャーキャピタル") || text.includes("起業") || text.includes("インキュベーション") || text.includes("ファンド");
        if (industry === "ゲーム") return text.includes("ゲーム") || text.includes("game");
        if (industry === "コンサルティング") return text.includes("コンサル");
        if (industry === "スポーツ") return text.includes("スポーツ") || text.includes("sports");
        if (industry === "ファッション/アパレル") return text.includes("ファッション") || text.includes("アパレル") || text.includes("服") || text.includes("fashion");
        if (industry === "ブライダル") return text.includes("ブライダル") || text.includes("ウエディング") || text.includes("結婚");
        if (industry === "メーカー") return text.includes("メーカー") || text.includes("製造");
        if (industry === "メディア") return text.includes("メディア") || text.includes("出版") || text.includes("放送") || text.includes("新聞") || text.includes("テレビ");
        if (industry === "教育") return text.includes("教育") || text.includes("スクール") || text.includes("塾") || text.includes("学習");
        if (industry === "金融") return text.includes("金融") || text.includes("銀行") || text.includes("証券") || text.includes("保険") || text.includes("フィンテック");
        if (industry === "広告") return text.includes("広告") || text.includes("アド") || text.includes("pr") || text.includes("プロモーション");
        if (industry === "商社") return text.includes("商社");
        if (industry === "人材") return text.includes("人材") || text.includes("hr") || text.includes("採用") || text.includes("キャリア");
        if (industry === "医療") return text.includes("医療") || text.includes("メディカル") || text.includes("看護") || text.includes("ヘルスケア");
        if (industry === "農業") return text.includes("農業") || text.includes("アグリ");
        if (industry === "不動産") return text.includes("不動産") || text.includes("住宅") || text.includes("建設") || text.includes("建築");
        if (industry === "士業") return text.includes("税理士") || text.includes("会計士") || text.includes("弁護士") || text.includes("司法書士") || text.includes("労務");
        if (industry === "旅行/レジャー/エンタメ") return text.includes("旅行") || text.includes("観光") || text.includes("エンタメ") || text.includes("レジャー") || text.includes("イベント");
        if (industry === "食") return text.includes("食") || text.includes("飲食") || text.includes("フード");
        if (industry === "官公庁") return text.includes("官公庁") || text.includes("自治体") || text.includes("公務員") || text.includes("市役所");
        if (industry === "その他") return text.includes("その他");
        return false;
    };

    // State
    const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
    const [selectedAreaId, setSelectedAreaId] = useState("all");
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [selectedIndustry, setSelectedIndustry] = useState("すべて");

    const toggleFeature = (feat: string) => {
        setSelectedFeatures(prev =>
            prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
        );
    };

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "すべて" || getCategory(job.title) === selectedCategory;
        const matchesArea = checkArea(job, selectedAreaId);
        const matchesFeature = checkFeature(job, selectedFeatures);
        const matchesIndustry = checkIndustry(job, selectedIndustry);
        return matchesSearch && matchesCategory && matchesArea && matchesFeature && matchesIndustry;
    });

    // UI Helper Component for Filter Chips
    const FilterChip = ({
        label,
        active,
        onClick
    }: {
        label: string;
        active: boolean;
        onClick: () => void
    }) => (
        <button
            onClick={onClick}
            className={clsx(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                active
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-surface text-muted-foreground border-border hover:border-gray-400 hover:text-foreground"
            )}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-black selection:text-white">
            <Header />

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-6 max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-full shadow-sm mb-8">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        <span className="text-xs font-medium text-foreground tracking-wide">未経験から始める、新しいキャリア</span>
                    </div>

                    <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
                        RE:BOOT<span className="text-accent text-3xl align-top">.</span>
                    </h1>

                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12 font-light">
                        主要求人サイトから「未経験歓迎」のインターン・求人を厳選。<br className="hidden md:block" />
                        効率よく、あなたの可能性を広げる一歩を見つけましょう。
                    </p>

                    {/* Minimal Search Bar */}
                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative flex items-center bg-surface border border-border rounded-full p-2 shadow-soft transition-all focus-within:ring-2 focus-within:ring-primary/5 focus-within:border-primary">
                            <Search className="w-5 h-5 ml-4 text-muted-foreground shrink-0" />
                            <input
                                type="text"
                                placeholder="キーワード（例: エンジニア、週3）"
                                className="w-full bg-transparent border-none focus:ring-0 px-4 py-2 text-foreground placeholder:text-muted/60 text-base"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity text-sm shrink-0">
                                検索
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Filters */}
            <section className="container mx-auto px-6 mb-20 max-w-7xl">
                <div className="space-y-8">
                    {/* Area */}
                    <div>
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Area / エリア</h3>
                        <div className="flex flex-wrap gap-2">
                            <FilterChip label="全国" active={selectedAreaId === "all"} onClick={() => setSelectedAreaId("all")} />
                            {areas.filter(a => a.id !== "all").map(area => (
                                <FilterChip
                                    key={area.id}
                                    label={area.name}
                                    active={selectedAreaId === area.id || !!area.children?.some(c => c.id === selectedAreaId)}
                                    onClick={() => setSelectedAreaId(area.id)}
                                />
                            ))}
                        </div>

                        {/* Sub Areas */}
                        {(() => {
                            const parentArea = areas.find(a => a.id !== "all" && (a.id === selectedAreaId || a.children?.some(c => c.id === selectedAreaId)));
                            if (parentArea && parentArea.children) {
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-4 flex flex-wrap gap-2 pl-4 border-l-2 border-border"
                                    >
                                        <button
                                            onClick={() => setSelectedAreaId(parentArea.id)}
                                            className={clsx("text-sm px-3 py-1 rounded-md transition-colors", selectedAreaId === parentArea.id ? "bg-secondary font-medium" : "text-muted-foreground hover:text-foreground")}
                                        >
                                            全域
                                        </button>
                                        {parentArea.children.map(child => (
                                            <button
                                                key={child.id}
                                                onClick={() => setSelectedAreaId(child.id)}
                                                className={clsx("text-sm px-3 py-1 rounded-md transition-colors", selectedAreaId === child.id ? "bg-secondary font-medium" : "text-muted-foreground hover:text-foreground")}
                                            >
                                                {child.name}
                                            </button>
                                        ))}
                                    </motion.div>
                                );
                            }
                            return null;
                        })()}
                    </div>

                    {/* Industry */}
                    <div>
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Industry / 業界</h3>
                        <div className="flex flex-wrap gap-2">
                            {industries.map(ind => (
                                <FilterChip key={ind} label={ind} active={selectedIndustry === ind} onClick={() => setSelectedIndustry(ind)} />
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Category / 職種</h3>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <FilterChip key={cat} label={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(cat)} />
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Feature / 特徴</h3>
                        <div className="flex flex-wrap gap-2">
                            {features.map(feat => (
                                <FilterChip key={feat} label={feat} active={selectedFeatures.includes(feat)} onClick={() => toggleFeature(feat)} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="container mx-auto px-6 pb-32 max-w-7xl">
                <div className="flex items-end justify-between mb-12 border-b border-border pb-4">
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                        募集中の求人
                    </h2>
                    <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                        {filteredJobs.length} results
                    </span>
                </div>

                <div className="space-y-24">
                    {categories.filter(cat => cat !== "すべて").map((category) => {
                        if (selectedCategory !== "すべて" && selectedCategory !== category) return null;

                        const categoryJobs = filteredJobs.filter(job => getCategory(job.title) === category);
                        if (categoryJobs.length === 0) return null;

                        const currentCount = visibleCounts[category] || 6;
                        const shownJobs = categoryJobs.slice(0, currentCount);
                        const hasMore = categoryJobs.length > currentCount;

                        return (
                            <div key={category}>
                                <div className="flex items-center gap-4 mb-8">
                                    <h3 className="text-xl font-bold tracking-tight">{category}</h3>
                                    <div className="h-[1px] flex-1 bg-border"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {shownJobs.map((job, index) => (
                                        <motion.div
                                            key={`${category}-${index}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ y: -4, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}
                                            className="group relative bg-surface rounded-2xl p-6 border border-border transition-all duration-300 flex flex-col h-full"
                                        >
                                            <a href={`/jobs/${job.id}`} className="absolute inset-0 z-0 rounded-2xl" aria-label={job.title}></a>

                                            {/* Top Metadata */}
                                            <div className="flex justify-between items-start mb-4 relative z-10 pointer-events-none">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-2 py-1 rounded-md bg-secondary/50">
                                                    {category}
                                                </span>
                                                {job.salary && (
                                                    <span className="text-xs font-semibold text-accent truncate max-w-[120px]">
                                                        {job.salary}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-bold text-lg leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2 relative z-10 pointer-events-none min-h-[3.5rem]">
                                                {job.title}
                                            </h3>

                                            {/* Company */}
                                            <div className="flex items-center gap-2 text-sm text-foreground/60 mb-6 relative z-10 pointer-events-none">
                                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                                <span className="truncate font-medium">{job.company}</span>
                                            </div>

                                            {/* Bottom Metadata */}
                                            <div className="mt-auto pt-4 border-t border-dashed border-border flex items-center justify-between relative z-10 pointer-events-none">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {job.location ? <span>{job.location}</span> : <span>勤務地相談</span>}
                                                </div>
                                                <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {hasMore && (
                                    <div className="flex justify-center mt-12">
                                        <button
                                            onClick={() => setVisibleCounts(prev => ({
                                                ...prev,
                                                [category]: (prev[category] || 6) + 6
                                            }))}
                                            className="px-8 py-3 bg-surface border border-border text-foreground font-medium rounded-full hover:bg-secondary transition-colors text-sm shadow-sm"
                                        >
                                            Show more
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <Footer />
        </div>
    );
}
