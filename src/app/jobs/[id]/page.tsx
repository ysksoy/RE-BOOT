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
        <main className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-foreground selection:text-background">
            <Header />

            <article className="container mx-auto px-6 py-12 max-w-5xl">
                {/* Minimal Job Header */}
                <div className="mb-12">
                    <div className="flex flex-wrap gap-2 mb-4">  {/* gap reduced */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-foreground text-background rounded-md text-[10px] font-bold uppercase tracking-wider"> {/* rounded-md, black bg */}
                            <Tag className="w-3 h-3" />
                            {category}
                        </span>
                        {job.prefecture && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary border border-border text-foreground rounded-md text-[10px] font-medium"> {/* rounded-md */}
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                {job.prefecture}
                            </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-1 bg-surface border border-border text-muted-foreground rounded-md text-[10px] font-medium"> {/* rounded-md */}
                            {job.source}
                        </span>
                    </div>

                    <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-8 leading-tight">
                        {job.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-8 py-8 border-y border-border">
                        <div className="flex items-start gap-4 min-w-[240px]">
                            <div className="p-2 bg-secondary rounded-md border border-border/50"> {/* rounded-md */}
                                <Building2 className="w-5 h-5 text-foreground" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Company</div>
                                <div className="font-bold text-lg">{job.company}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-secondary rounded-md border border-border/50"> {/* rounded-md */}
                                <Banknote className="w-5 h-5 text-foreground" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Salary</div>
                                <div className="font-bold text-lg">{job.salary || "要確認"}</div>
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
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <span className="w-1 h-6 bg-foreground rounded-sm"></span> {/* sharper line */}
                                Job Details
                            </h2>
                            <div className="prose prose-zinc prose-lg text-foreground/80 leading-loose max-w-none whitespace-pre-wrap font-normal">
                                {job.summary || "詳細は応募ページにてご確認ください。"}
                            </div>

                            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground bg-secondary/30 p-4 rounded-lg border border-border/60"> {/* rounded-lg */}
                                <MapPin className="w-4 h-4 text-foreground/60" />
                                <span className="font-medium">{job.location}</span>
                            </div>
                        </section>

                        {/* AdSpace */}
                        <section className="bg-secondary/10 rounded-lg min-h-[160px] flex items-center justify-center border border-dashed border-border/80"> {/* rounded-lg */}
                            <span className="text-muted-foreground font-medium text-xs tracking-widest uppercase">Advertisement</span>
                        </section>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Apply Card */}
                        <div className="bg-surface rounded-xl p-6 shadow-sm border border-border sticky top-8"> {/* rounded-xl (smaller) */}
                            <h3 className="font-bold text-lg mb-2 text-center">Application</h3>
                            <p className="text-xs text-center text-muted-foreground mb-6 leading-relaxed">
                                外部サイトへ遷移します
                            </p>

                            <a
                                href={job.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex w-full py-3.5 bg-primary text-primary-foreground font-bold text-center rounded-lg hover:bg-foreground/90 transition-all items-center justify-center gap-2 shadow-sm" // rounded-lg
                            >
                                <span className="text-sm tracking-wide">求人に応募する</span>
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </a>

                            <div className="mt-4 pt-4 border-t border-dashed border-border text-[10px] text-center text-muted-foreground uppercase tracking-widest">
                                Source: {job.source}
                            </div>
                        </div>

                        {/* Editorial Recommendation */}
                        <section className="bg-secondary/20 rounded-xl p-6 border border-border relative overflow-hidden mt-6"> {/* rounded-xl */}
                            <h2 className="font-bold text-sm mb-3 flex items-center gap-2 text-foreground">
                                <CheckCircle2 className="w-4 h-4 text-foreground" />
                                Editorial Note
                            </h2>
                            <p className="text-muted-foreground text-xs leading-relaxed relative z-10 font-medium">
                                <strong className="text-foreground block mb-1.5">【{category}への挑戦】</strong>
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
