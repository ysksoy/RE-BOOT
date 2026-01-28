"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real application, submit logic goes here.
        // For now, we simulate a successful submission.
        setSubmitted(true);
    };

    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden bg-soft-bg selection:bg-primary/30">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

            <Header />

            <section className="relative z-10 container mx-auto px-4 py-12 max-w-xl flex-grow flex flex-col justify-center">
                <h1 className="font-display text-3xl font-bold mb-8 text-foreground text-center">お問い合わせ</h1>

                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-10 rounded-3xl shadow-soft text-center border border-foreground/5"
                    >
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-4">送信完了しました</h2>
                        <p className="text-foreground/70 font-sans leading-relaxed">
                            お問い合わせありがとうございます。<br />
                            内容を確認次第、担当者よりご連絡させていただきます。
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="mt-8 text-primary font-bold hover:underline text-sm"
                        >
                            フォームに戻る
                        </button>
                    </motion.div>
                ) : (
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 md:p-10 rounded-3xl shadow-soft space-y-6 border border-foreground/5"
                    >
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-bold text-foreground/70">お名前 <span className="text-secondary text-xs ml-1">必須</span></label>
                            <input type="text" id="name" required className="w-full px-4 py-3 rounded-xl bg-soft-bg border border-transparent focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-sans" placeholder="山田 太郎" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-bold text-foreground/70">メールアドレス <span className="text-secondary text-xs ml-1">必須</span></label>
                            <input type="email" id="email" required className="w-full px-4 py-3 rounded-xl bg-soft-bg border border-transparent focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-sans" placeholder="example@email.com" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="block text-sm font-bold text-foreground/70">お問い合わせ内容 <span className="text-secondary text-xs ml-1">必須</span></label>
                            <textarea id="message" required rows={5} className="w-full px-4 py-3 rounded-xl bg-soft-bg border border-transparent focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none font-sans" placeholder="ご質問やご要望をご記入ください"></textarea>
                        </div>

                        <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mt-4">
                            送信する
                        </button>
                    </motion.form>
                )}
            </section>

            <Footer />
        </main>
    );
}
