import Image from "next/image";
import Link from "next/link";

export function Header() {
    return (
        <header className="relative z-10 w-full py-6">
            <div className="container mx-auto px-6 md:px-8 max-w-7xl flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-3 hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-surface border border-border rounded-xl shadow-sm flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 group-hover:shadow-md">
                        <Image src="/icon.png" alt="RE:BOOT Icon" width={20} height={20} className="w-5 h-5 object-contain" />
                    </div>
                    <span className="font-display font-bold text-xl tracking-tighter text-foreground group-hover:text-primary transition-colors">
                        RE:BOOT
                    </span>
                </Link>

                {/* Optional: Add minimal nav links here later */}
            </div>
        </header>
    );
}
