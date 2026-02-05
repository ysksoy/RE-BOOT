
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import jobsData from "@/data/jobs.json";
import { getCategory, getRecommendationMessage } from "@/lib/jobUtils";
import { notFound } from "next/navigation";
import { MapPin, Building2, Banknote, Tag, ExternalLink, CheckCircle2 } from "lucide-react";

// 型定義
type Job = {
    id?: string;
    title: string;
    company: string;
    location: string;
    salary: string | null;
    summary: string | null;
    link: string | null;
    prefecture?: string;
    image_url?: string;
    source?: string;
};

// Next.js 15+ compatible metadata generation
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const allJobs = (Array.isArray(jobsData) ? jobsData : (jobsData as any).jobs || []) as Job[];
    const job = allJobs.find((j) => j.id === id);

    if (!job) return { title: "求人が見つかりません | RE:BOOT" };

    return {
        title: `${job.title} | RE:BOOT`,
        description: `RE:BOOTで「${job.title}」の詳細情報をチェック。未経験から挑戦できる、${job.company}の求人情報です。`,
        openGraph: {
            // images: job.image_url ? [job.image_url] : [],
        }
    };
}

// Next.js 15+ compatible page component
export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // データ取得
    const allJobs = (Array.isArray(jobsData) ? jobsData : (jobsData as any).jobs || []) as Job[];
    const job = allJobs.find((j) => j.id === id);

    if (!job) {
        notFound();
    }

    const category = getCategory(job.title);
    const recommendation = getRecommendationMessage(category, job.title);

    return (
        <main className="min-h-screen flex flex-col bg-soft-bg selection:bg-primary/30 font-sans">
            {/* Header */}
            <Header />

            <article className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Job Header */}
                <div className="bg-white rounded-3xl p-8 shadow-soft mb-8 border border-foreground/5">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {category}
                        </span>
                        {job.prefecture && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.prefecture}
                            </span>
                        )}
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                            {job.source}
                        </span>
                    </div>

                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 leading-relaxed">
                        {job.title}
                    </h1>

                    <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-sm text-foreground/70 border-t border-dashed border-gray-100 pt-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-400 font-bold mb-0.5">会社名</div>
                                <div className="font-bold text-foreground">{job.company}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <Banknote className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-400 font-bold mb-0.5">給与</div>
                                <div className="font-bold text-foreground">{job.salary || "要確認"}</div>
                            </div>
                        </div>
                    </div>
                </div>




                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column: Details & Recommendation */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Summary Section */}
                        <section className="bg-white rounded-3xl p-8 shadow-soft border border-foreground/5">
                            <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                                求人概要
                            </h2>
                            <p className="leading-loose text-foreground/80 whitespace-pre-wrap">
                                {job.summary || "詳細は応募ページにてご確認ください。"}
                            </p>

                            <div className="mt-8 p-4 bg-gray-50 rounded-2xl flex items-start gap-3 text-sm text-foreground/70">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span>{job.location}</span>
                            </div>
                        </section>



                        {/* AdSense Placeholder */}
                        <section className="bg-gray-100/50 rounded-xl min-h-[250px] flex items-center justify-center border-2 border-dashed border-gray-200">
                            <span className="text-gray-400 font-bold text-sm">広告スペース</span>
                        </section>


                    </div>

                    {/* Right Column: CTA & Info */}
                    <div className="md:col-span-1 space-y-6">
                        {/* CTA Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-soft border border-foreground/5 sticky top-24">
                            <h3 className="font-bold text-lg mb-4 text-center">この求人が気になりますか？</h3>
                            <p className="text-sm text-center text-foreground/60 mb-6">
                                掲載元のサイトで詳細を確認し、応募手続きへ進んでください。
                            </p>

                            <a
                                href={job.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-4 bg-primary text-white font-bold text-center rounded-xl hover:bg-primary/90 hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="text-lg">応募ページへ進む</span>
                                <ExternalLink className="w-5 h-5" />
                            </a>

                            <div className="mt-4 text-xs text-center text-gray-400">
                                外部サイト（{job.source}）へ遷移します
                            </div>
                        </div>

                        {/* RE:BOOT Recommendation (Crucial for AdSense) */}
                        <section className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-6 border border-primary/20 relative overflow-hidden sticky top-[400px]">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

                            <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2 text-primary">
                                <CheckCircle2 className="w-5 h-5" />
                                編集部のおすすめ
                            </h2>
                            <p className="text-foreground/80 text-sm leading-relaxed">
                                <b>【未経験から{category}へ挑戦！】</b><br />
                                {recommendation}
                            </p>
                        </section>
                    </div>

                </div>
            </article>

            {/* Footer */}
            <Footer />
        </main>
    );
}
