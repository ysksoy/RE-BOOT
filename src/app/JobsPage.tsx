"use client";

import { useState } from "react";
import { Search, MapPin, Building2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCategory } from "@/lib/jobUtils";
import type { Job } from "@/lib/fetchJobs";

export default function JobsPage({ jobs }: { jobs: Job[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("すべて");

    const categories = ["すべて", "エンジニア", "デザイナー", "営業", "企画", "マーケティング", "編集/ライター", "その他"];

    // Area definitions
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

    const features = [
        "週3日以下でもOK",
        "週4日以上歓迎",
        "1ヶ月からOK",
        "フルリモート可",
        "一部リモート可",
        "1・2年生歓迎",
        "3年生歓迎",
        "4年生歓迎",
    ];

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

    const industries = [
        "すべて",
        "IT",
        "VC/起業支援",
        "ゲーム",
        "コンサルティング",
        "スポーツ",
        "ファッション/アパレル",
        "ブライダル",
        "メーカー",
        "メディア",
        "教育",
        "金融",
        "広告",
        "商社",
        "人材",
        "医療",
        "農業",
        "不動産",
        "士業",
        "旅行/レジャー/エンタメ",
        "食",
        "官公庁",
        "その他"
    ];

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

    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden bg-soft-bg selection:bg-primary/30">
            {/* Decorative Soft Blobs */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

            <Header />

            {/* Hero Section */}
            <section className="relative z-10 container mx-auto px-4 pt-16 pb-20 text-center max-w-3xl mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-block px-4 py-2 bg-white rounded-full shadow-soft mb-8">
                        <span className="font-sans text-sm text-accent-foreground font-medium flex items-center gap-2">
                            <Image src="/icon.png" alt="" width={16} height={16} className="w-4 h-4 object-contain" />
                            未経験から始める、最初の一歩。
                        </span>
                    </div>

                    <h1 className="font-display text-4xl md:text-6xl leading-tight mb-8 text-foreground font-bold tracking-tight">
                        RE:BOOT
                    </h1>

                    <p className="font-sans text-foreground/60 leading-relaxed text-lg mb-12 max-w-2xl mx-auto">
                        RE:BOOTは、主要な求人サイトから<br />
                        <span className="bg-secondary/20 px-2 py-0.5 rounded-sm font-bold text-foreground/80 box-decoration-clone mx-1">未経験から挑戦できる求人のみをまとめて検索できる</span><span className="whitespace-nowrap">サービスです。</span><br />
                        複数のサイトを行き来する手間を省いて、効率よく。<br />
                        まずはここから、新しいキャリアのきっかけを探してみませんか？
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative bg-white p-2 rounded-full shadow-soft-hover flex items-center transition-all duration-300 ring-1 ring-border/5 focus-within:ring-primary/50">
                            <div className="pl-4 text-muted">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="キーワードで探す（例: エンジニア、リモート）"
                                className="w-full h-12 bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted/70 font-sans"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="h-10 px-6 bg-primary text-white font-bold rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-sm whitespace-nowrap flex-shrink-0">
                                検索
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Filters Section */}
            <section className="relative z-10 container mx-auto px-4 mb-12 space-y-6">

                {/* 1. Area Tabs (Blue) */}
                <div>
                    <h3 className="text-sm font-bold text-foreground/50 mb-3 px-1 font-sans">エリア</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <button
                            onClick={() => setSelectedAreaId("all")}
                            className={clsx(
                                "px-4 py-2 rounded-full text-sm font-bold font-sans transition-all duration-200",
                                selectedAreaId === "all"
                                    ? "bg-blue-100 text-foreground shadow-sm"
                                    : "bg-white text-foreground/70 hover:bg-white/80 hover:text-foreground shadow-sm"
                            )}
                        >
                            全国
                        </button>
                        {areas.filter(a => a.id !== "all").map((area) => {
                            const isSelected = selectedAreaId === area.id || area.children?.some(c => c.id === selectedAreaId);
                            return (
                                <button
                                    key={area.id}
                                    onClick={() => setSelectedAreaId(area.id)}
                                    className={clsx(
                                        "px-4 py-2 rounded-full text-sm font-bold font-sans transition-all duration-200",
                                        isSelected
                                            ? "bg-blue-100 text-foreground shadow-sm"
                                            : "bg-white text-foreground/70 hover:bg-white/80 hover:text-foreground shadow-sm"
                                    )}
                                >
                                    {area.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Level 2 Areas (Sub-areas) */}
                    {(() => {
                        const parentArea = areas.find(a =>
                            a.id !== "all" && (a.id === selectedAreaId || a.children?.some(c => c.id === selectedAreaId))
                        );

                        if (parentArea && parentArea.children) {
                            return (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="flex flex-wrap gap-2 pl-4 border-l-2 border-blue-100"
                                >
                                    <button
                                        onClick={() => setSelectedAreaId(parentArea.id)}
                                        className={clsx(
                                            "px-3 py-1.5 rounded-full text-xs font-bold font-sans transition-all duration-200",
                                            selectedAreaId === parentArea.id
                                                ? "bg-blue-50 text-foreground"
                                                : "bg-white/50 text-foreground/60 hover:bg-white hover:text-foreground"
                                        )}
                                    >
                                        {parentArea.name}全域
                                    </button>
                                    {parentArea.children.map((child) => (
                                        <button
                                            key={child.id}
                                            onClick={() => setSelectedAreaId(child.id)}
                                            className={clsx(
                                                "px-3 py-1.5 rounded-full text-xs font-bold font-sans transition-all duration-200",
                                                selectedAreaId === child.id
                                                    ? "bg-blue-50 text-foreground"
                                                    : "bg-white/50 text-foreground/60 hover:bg-white hover:text-foreground"
                                            )}
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

                {/* 2. Industry Tabs (Green) */}
                <div>
                    <h3 className="text-sm font-bold text-foreground/50 mb-3 px-1 font-sans">業界</h3>
                    <div className="flex flex-wrap gap-2">
                        {industries.map((ind) => (
                            <button
                                key={ind}
                                onClick={() => setSelectedIndustry(ind)}
                                className={clsx(
                                    "px-4 py-2 rounded-full text-sm font-bold font-sans transition-all duration-200",
                                    selectedIndustry === ind
                                        ? "bg-emerald-100 text-foreground shadow-sm"
                                        : "bg-white text-foreground/70 hover:bg-white/80 hover:text-foreground shadow-sm"
                                )}
                            >
                                {ind}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Category Tabs (Orange) */}
                <div>
                    <h3 className="text-sm font-bold text-foreground/50 mb-3 px-1 font-sans">カテゴリ</h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={clsx(
                                    "px-4 py-2 rounded-full text-sm font-bold font-sans transition-all duration-200",
                                    selectedCategory === cat
                                        ? "bg-orange-100 text-foreground shadow-sm"
                                        : "bg-white text-foreground/70 hover:bg-white/80 hover:text-foreground shadow-sm"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Feature Tabs (Purple) */}
                <div>
                    <h3 className="text-sm font-bold text-foreground/50 mb-3 px-1 font-sans">特徴</h3>
                    <div className="flex flex-wrap gap-2">
                        {features.map((feat) => (
                            <button
                                key={feat}
                                onClick={() => toggleFeature(feat)}
                                className={clsx(
                                    "px-4 py-2 rounded-full text-sm font-bold font-sans transition-all duration-200",
                                    selectedFeatures.includes(feat)
                                        ? "bg-purple-100 text-foreground shadow-sm"
                                        : "bg-white text-foreground/70 hover:bg-white/80 hover:text-foreground shadow-sm"
                                )}
                            >
                                {feat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Job List */}
            <section className="relative z-10 container mx-auto px-4 pb-32">
                <div className="flex items-center justify-between mb-10 px-2">
                    <h2 className="font-display text-2xl text-foreground font-bold flex items-center gap-3">
                        <span className="w-2 h-8 bg-secondary rounded-full"></span>
                        募集中のアルバイト・インターン
                    </h2>
                    <span className="font-sans text-sm text-muted bg-white px-3 py-1 rounded-full shadow-sm">
                        {filteredJobs.length} 件
                    </span>
                </div>

                <div className="space-y-16">
                    {categories.filter(cat => cat !== "すべて").map((category) => {
                        if (selectedCategory !== "すべて" && selectedCategory !== category) return null;

                        const categoryJobs = filteredJobs.filter(job => getCategory(job.title) === category);
                        if (categoryJobs.length === 0) return null;

                        const currentCount = visibleCounts[category] || 6;
                        const shownJobs = categoryJobs.slice(0, currentCount);
                        const hasMore = categoryJobs.length > currentCount;

                        return (
                            <div key={category}>
                                <h3 className={clsx(
                                    "font-display text-xl font-bold mb-6 text-foreground/80 pl-4 border-l-4 flex items-center gap-2",
                                    category === "エンジニア" ? "border-blue-300" :
                                        category === "デザイナー" ? "border-pink-300" :
                                            category === "マーケティング" ? "border-purple-300" :
                                                category === "営業" ? "border-green-300" :
                                                    category === "企画" ? "border-orange-300" :
                                                        category === "編集/ライター" ? "border-cyan-300" :
                                                            "border-gray-300"
                                )}>
                                    {category}
                                    <span className="text-sm font-normal text-muted bg-soft-bg px-2 py-0.5 rounded-full">
                                        {categoryJobs.length}
                                    </span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {shownJobs.map((job, index) => (
                                        <motion.div
                                            key={`${category}-${index}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                            className="bg-surface rounded-2xl p-6 shadow-soft hover:shadow-soft-hover border border-foreground/10 hover:border-primary transition-all group flex flex-col h-full relative"
                                        >
                                            <a href={`/jobs/${job.id}`} className="absolute inset-0 z-0 rounded-2xl" aria-label={job.title}></a>

                                            <div className="flex items-start justify-between mb-4 relative z-10 pointer-events-none">
                                                <span className={clsx(
                                                    "text-xs px-3 py-1 rounded-full border font-medium",
                                                    category === "エンジニア" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                        category === "デザイナー" ? "bg-pink-50 text-pink-600 border-pink-100" :
                                                            category === "マーケティング" ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                                category === "営業" ? "bg-green-50 text-green-600 border-green-100" :
                                                                    category === "企画" ? "bg-orange-50 text-orange-600 border-orange-100" :
                                                                        category === "編集/ライター" ? "bg-cyan-50 text-cyan-600 border-cyan-100" :
                                                                            "bg-gray-50 text-gray-600 border-gray-100"
                                                )}>
                                                    {category}
                                                </span>
                                                {job.salary && (
                                                    <span className="text-secondary font-bold text-sm bg-secondary/10 px-3 py-1 rounded-full max-w-[150px] truncate block" title={job.salary}>
                                                        {job.salary}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="font-display text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2 relative z-10 pointer-events-none">
                                                {job.title}
                                            </h3>

                                            <div className="flex items-center gap-2 text-sm text-foreground/50 mb-6 font-sans relative z-10 pointer-events-none">
                                                <Building2 className="w-4 h-4" />
                                                <span className="truncate">{job.company}</span>
                                            </div>

                                            {job.summary && (
                                                <p className="text-sm text-foreground/70 line-clamp-3 mb-6 bg-soft-bg p-3 rounded-xl leading-relaxed relative z-10 pointer-events-none">
                                                    {job.summary}
                                                </p>
                                            )}

                                            <div className="mt-auto pt-4 border-t border-dashed border-foreground/10 flex items-center justify-between relative z-10 pointer-events-none">
                                                {job.location && (
                                                    <div className="flex items-center gap-1.5 text-xs text-foreground/40 font-medium">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span>{job.location}</span>
                                                    </div>
                                                )}
                                                <span className="w-8 h-8 rounded-full bg-soft-bg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {hasMore && (
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => setVisibleCounts(prev => ({
                                                ...prev,
                                                [category]: (prev[category] || 6) + 6
                                            }))}
                                            className="px-6 py-3 bg-white border border-foreground/10 text-foreground/70 rounded-full font-bold text-sm shadow-sm hover:bg-soft-bg hover:text-foreground hover:scale-105 transition-all flex items-center gap-2"
                                        >
                                            <span className="w-6 h-6 rounded-full bg-foreground/5 flex items-center justify-center text-lg leading-none">+</span>
                                            もっと見る
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <Footer />
        </main>
    );
}
