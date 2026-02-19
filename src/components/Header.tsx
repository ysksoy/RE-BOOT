import Image from "next/image";
import Link from "next/link";

export function Header() {
    return (
        <header className="relative z-10 w-full py-6">
            <div className="container mx-auto px-6 md:px-8 max-w-7xl flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-3 hover:opacity-100 transition-opacity">
                    <div className="w-9 h-9 bg-surface border border-border rounded-md shadow-sm flex items-center justify-center overflow-hidden transition-transform group-hover:shadow-md"> {/* rounded-md */}
                        <Image src="/icon.png" alt="RE:BOOT Icon" width={18} height={18} className="w-4.5 h-4.5 object-contain" />
                    </div>
                    <span className="font-display font-bold text-lg tracking-tighter text-foreground group-hover:text-muted-foreground transition-colors">
                        RE:BOOT
                    </span>
                </Link>
            </div>
        </header>
    );
}
