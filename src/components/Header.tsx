import Image from "next/image";
import Link from "next/link";

export function Header() {
    return (
        <header className="relative z-10 w-full py-6 px-4 md:px-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-white rounded-xl shadow-soft flex items-center justify-center text-primary overflow-hidden">
                    <Image src="/icon.png" alt="RE:BOOT Icon" width={24} height={24} className="w-6 h-6 object-contain" />
                </div>
                <span className="font-display font-bold text-xl tracking-wide text-foreground">RE:BOOT</span>
            </Link>
        </header>
    );
}
