"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { User, Heart, Briefcase, Lightbulb } from "lucide-react";

export default function About() {
    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden bg-soft-bg selection:bg-primary/30">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

            <Header />

            <section className="relative z-10 container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="font-display text-3xl font-bold mb-8 text-foreground text-center">
                    運営者・開発経緯について
                </h1>

                <div className="space-y-8">
                    {/* Operator Profile Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-soft flex flex-col md:flex-row items-center gap-6 border border-foreground/5">
                        <div className="w-24 h-24 bg-soft-bg rounded-full flex items-center justify-center text-primary flex-shrink-0">
                            <User className="w-10 h-10" />
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-sm font-bold text-secondary mb-1">Operator</div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Houtoku</h2>
                            <p className="text-foreground/60 font-sans text-sm">
                                RE:BOOT 開発者 / 運営者
                            </p>
                        </div>
                    </div>

                    {/* Story Section */}
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-soft border border-foreground/5 space-y-10">

                        {/* Introduction */}
                        <section>
                            <div className="flex items-center gap-3 mb-4 text-primary">
                                <Heart className="w-6 h-6" />
                                <h3 className="font-bold text-lg text-foreground">「就職浪人」という選択肢を、もっと当たり前に。</h3>
                            </div>
                            <p className="text-foreground/80 leading-loose font-sans">
                                私自身、大学受験での浪人と、就職活動での「就職浪人」の二つを経験しました。<br /><br />
                                就職活動を通して心を病んでしまったり、自ら命を絶ってしまう方がいるというニュースを見るたび、胸が締め付けられる思いがしました。「もっと多様な生き方が許されていい」「就職浪人も、受験浪人と同じくらい当たり前の選択肢として受け入れられていいんじゃないか」。そんな思いが、このサイトを作る原点にあります。
                            </p>
                        </section>

                        {/* The Problem */}
                        <section>
                            <div className="flex items-center gap-3 mb-4 text-secondary">
                                <Briefcase className="w-6 h-6" />
                                <h3 className="font-bold text-lg text-foreground">「ガクチカ」がない焦りと、情報の洪水。</h3>
                            </div>
                            <p className="text-foreground/80 leading-loose font-sans">
                                私自身の就活を振り返ると、自信を持って「ガクチカ（学生時代に力を入れたこと）」として語れる経験が少なく、大きな苦しさを感じていました。<br />
                                「もっと早いうちから、将来の役に立つインターンや実務経験を積んでおけばよかった」<br /><br />
                                そう深く後悔しましたが、いざ経験を積もうとアルバイトやインターンを探しても、壁にぶつかりました。
                                世の中の求人サイトは情報が多すぎたのです。検索しても、本当に自分のキャリアに繋がりそうな「未経験歓迎のオフィスワーク」や「スキルアップできるインターン」は、大量の飲食や軽作業の情報の海に埋もれてしまい、見つけ出すだけで一苦労でした。<br /><br />
                                就活への不安で鬱屈とした気持ちの中、複雑な条件設定をして求人を探し続ける作業は、あまりにも大きな負担でした。
                            </p>
                        </section>

                        {/* The Solution */}
                        <section>
                            <div className="flex items-center gap-3 mb-4 text-orange-400">
                                <Lightbulb className="w-6 h-6" />
                                <h3 className="font-bold text-lg text-foreground">RE:BOOTが目指すもの</h3>
                            </div>
                            <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                                <p className="text-foreground/80 leading-loose font-sans">
                                    そこで私は、<strong>大手求人サイトから「未経験歓迎」の求人に的を絞り、かつ将来のキャリア形成に直接役立ちにくいと思われる求人（単純作業や飲食など）を除外した</strong>、独自の求人プラットフォームをつくりました。<br /><br />
                                    RE:BOOT（リブート）には、「再起動」という意味があります。<br />
                                    今はまだ自信がなくても、ここから新しいキャリアの一歩を踏み出してほしい。<br />
                                    探す手間を極限まで減らし、あなたの挑戦を後押ししたい。<br /><br />
                                    このサイトが、誰かの新しいスタートのきっかけになれば幸いです。
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
