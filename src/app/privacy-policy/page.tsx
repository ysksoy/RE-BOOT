import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden bg-soft-bg selection:bg-primary/30">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

            <Header />

            <section className="relative z-10 container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="font-display text-3xl font-bold mb-8 text-foreground">プライバシーポリシー</h1>

                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-soft space-y-10">
                    <section>
                        <h2 className="text-xl font-bold mb-4 text-foreground border-l-4 border-primary pl-3">1. 個人情報の利用目的</h2>
                        <p className="text-foreground/80 leading-relaxed font-sans">
                            当サイトでは、お問い合わせや記事へのコメントの際、名前やメールアドレス等の個人情報を入力いただく場合がございます。<br />
                            取得した個人情報は、お問い合わせに対する回答や必要な情報を電子メール等でご連絡する場合に利用させていただくものであり、これらの目的以外では利用いたしません。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-foreground border-l-4 border-primary pl-3">2. 広告について</h2>
                        <p className="text-foreground/80 leading-relaxed font-sans">
                            当サイトでは、第三者配信の広告サービス（Googleアドセンス、A8.netなど）を利用しており、ユーザーの興味に応じた商品やサービスの広告を表示するため、クッキー（Cookie）を使用しております。<br />
                            クッキーを使用することで当サイトはお客様のコンピュータを識別できるようになりますが、お客様個人を特定できるものではありません。<br />
                            Cookieを無効にする方法やGoogleアドセンスに関する詳細は
                            <a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1 font-bold">
                                「広告 – ポリシーと規約 – Google」
                            </a>
                            をご確認ください。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-foreground border-l-4 border-primary pl-3">3. アクセス解析ツールについて</h2>
                        <p className="text-foreground/80 leading-relaxed font-sans">
                            当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。<br />
                            このGoogleアナリティクスはトラフィックデータの収集のためにクッキー（Cookie）を使用しております。トラフィックデータは匿名で収集されており、個人を特定するものではありません。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-foreground border-l-4 border-primary pl-3">4. 免責事項</h2>
                        <p className="text-foreground/80 leading-relaxed font-sans">
                            当サイトからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。<br />
                            また当サイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。<br />
                            当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
                        </p>
                    </section>
                </div>
            </section>

            <Footer />
        </main>
    );
}
