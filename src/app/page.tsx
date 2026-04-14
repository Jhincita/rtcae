import CasesCarousel from "@/components/CasesCarousel";
import Intro from "@/components/Intro";
import Intro2 from "@/components/Intro2";

export default function Home() {
    return (
        <main className="w-4/5 mx-auto pt-10">
            {/* Two columns side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Intro />
                <Intro2 />
            </div>
            {/* Other sections can go here */}
        </main>
    );
}