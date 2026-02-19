import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-secondary/30 border-t border-border py-16 mt-auto">
            <div className="container mx-auto px-6 text-center">
                <Link href="/" className="inline-block font-display font-bold text-2xl tracking-tighter text-foreground mb-8 hover:opacity-80 transition-opacity">
                    RE:BOOT.
                </Link>

                <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10 text-sm font-medium text-muted-foreground">
                    <Link href="/about" className="hover:text-foreground transition-colors">運営者情報</Link>
                    <Link href="/privacy-policy" className="hover:text-foreground transition-colors">プライバシーポリシー</Link>
                    <Link href="/contact" className="hover:text-foreground transition-colors">お問い合わせ</Link>
                </nav>

                <div className="text-xs text-muted-foreground/60 leading-loose">
                    <p>&copy; {new Date().getFullYear()} RE:BOOT Project. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
