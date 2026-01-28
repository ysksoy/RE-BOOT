import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-white border-t border-foreground/5 py-12 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p className="font-display font-bold text-xl text-foreground/20 mb-4">RE:BOOT PROJECT</p>
                <div className="flex justify-center gap-6 mb-6 text-sm text-foreground/60 font-sans">
                    <Link href="/about" className="hover:text-primary transition-colors">運営者情報</Link>
                    <Link href="/privacy-policy" className="hover:text-primary transition-colors">プライバシーポリシー</Link>
                    <Link href="/contact" className="hover:text-primary transition-colors">お問い合わせ</Link>
                </div>
                <p className="text-xs text-foreground/40 font-sans">
                    &copy; 2026 RE:BOOT. All rights reserved. <br />
                    Data source: Indeed, Kyujinbox, Infra, ZeroOne
                </p>
            </div>
        </footer>
    );
}
