import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { fetchJobById } from "@/lib/fetchJobs";
import { getCategory, getRecommendationMessage } from "@/lib/jobUtils";
import { notFound } from "next/navigation";
import { MapPin, Building2, Banknote, Tag, ExternalLink, CheckCircle2 } from "lucide-react";

export const revalidate = 3600; // 1時間ごとに再検証（ISR）

// Next.js 15+ compatible metadata generation
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const job = await fetchJobById(id);

    if (!job) return { title: "求人が見つかりません | RE:BOOT" };

    return {
        title: `${job.title} | RE:BOOT`,
        description: `Here is the detail of "${job.title}". Check out this job opportunity at ${job.company} for beginners.`,
        openGraph: {
            // images: job.image_url ? [job.image_url] : [],
        }
    };
}

// Next.js 15+ compatible page component
export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const job = await fetchJobById(id);

    if (!job) {
        notFound();
    }

    const category = getCategory(job.title);
    const recommendation = job.recommendation || getRecommendationMessage(category, job.title);

    return (
        <main className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary selection:text-white">
            <Header />

            <article className="container mx-auto px-6 py-12 max-w-5xl">
                {/* Minimal Job Header */}
                <div className="mb-12">
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider">
                            <Tag className="w-3 h-3" />
                            {category}
                        </span>
                        {job.prefecture && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-foreground rounded-full text-xs font-medium">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                {job.prefecture}
                            </span>
                        )}
                        <span className="inline-flex items-center px-3 py-1 bg-surface border border-border text-muted-foreground rounded-full text-xs font-medium">
                            {job.source}
                        </span>
                    </div>

                    <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-8 leading-tight">
                        {job.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-8 py-8 border-y border-border">
                        <div className="flex items-start gap-3 min-w-[200px]">
                            <div className="p-2 bg-secondary rounded-lg">
                                <Building2 className="w-5 h-5 text-foreground" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Company</div>
                                <div className="font-semibold text-lg">{job.company}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-secondary rounded-lg">
                                <Banknote className="w-5 h-5 text-foreground" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Salary</div>
                                <div className="font-semibold text-lg">{job.salary || "要確認"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Summary Section */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-primary rounded-full"></span>
                                求人詳細
                            </h2>
                            <div className="prose prose-lg text-foreground/80 leading-loose max-w-none whitespace-pre-wrap font-light">
                                {job.summary || "詳細は応募ページにてご確認ください。"}
                            </div>

                            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-4 rounded-xl border border-border">
                                <MapPin className="w-4 h-4" />
                                <span>勤務地詳細: {job.location}</span>
                            </div>
                        </section>

                        {/* AdSpace */}
                        <section className="bg-secondary/30 rounded-2xl min-h-[200px] flex items-center justify-center border border-dashed border-border">
                            <span className="text-muted-foreground font-medium text-sm tracking-widest">ADVERTISEMENT</span>
                        </section>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Apply Card */}
                        <div className="bg-surface rounded-2xl p-8 shadow-soft border border-border sticky top-24">
                            <h3 className="font-bold text-xl mb-4 text-center">応募について</h3>
                            <p className="text-sm text-center text-muted-foreground mb-8 leading-relaxed">
                                この求人は外部サイトで掲載されています。<br />
                                詳細ページより応募してください。
                            </p>

                            <a
                                href={job.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex w-full py-4 bg-primary text-primary-foreground font-bold text-center rounded-xl hover:opacity-90 transition-all items-center justify-center gap-2 shadow-lg shadow-primary/20"
                            >
                                <span className="text-lg">応募ページへ</span>
                                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>

                            <div className="mt-4 text-[10px] text-center text-muted-foreground uppercase tracking-widest">
                                via {job.source}
                            </div>
                        </div>

                        {/* Editorial Recommendation */}
                        <section className="bg-secondary/20 rounded-2xl p-8 border border-border relative overflow-hidden mt-8">
                            {/* Decorative Element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>

                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                                <CheckCircle2 className="w-5 h-5 text-accent" />
                                編集部コメント
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
                                <strong className="text-foreground block mb-2">【未経験から{category}へ】</strong>
                                {recommendation}
                            </p>
                        </section>
                    </div>

                </div>
            </article>

            <Footer />
        </main>
    );
}
