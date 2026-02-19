import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-border py-12 mt-auto bg-background"> {/* removed minimal secondary texture */}
            <div className="container mx-auto px-6 text-center">
                <Link href="/" className="inline-block font-display font-bold text-xl tracking-tighter text-foreground mb-6 hover:opacity-80 transition-opacity">
                    RE:BOOT.
                </Link>

                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
                    <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
                    <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
                </nav>

                <div className="text-[10px] text-muted-foreground font-mono"> {/* Smaller monospaced styling for tech feel */}
                    <p>&copy; {new Date().getFullYear()} RE:BOOT Project.</p>
                </div>
            </div>
        </footer>
    );
}
