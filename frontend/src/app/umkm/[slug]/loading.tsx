import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft } from "lucide-react";

export default function LoadingUmkmDetail() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="px-margin-mobile md:px-margin-desktop pt-lg mt-16">
        <div className="flex items-center gap-xs text-on-surface-variant font-label-md">
          <ChevronLeft size={16} /> <div className="h-4 w-32 bg-surface-variant animate-pulse rounded"></div>
        </div>
      </section>

      <section className="px-margin-mobile md:px-margin-desktop pt-lg pb-2xl grid grid-cols-1 md:grid-cols-3 gap-2xl">
        <div className="md:col-span-2">
          {/* Main Image */}
          <div className="w-full h-72 md:h-96 rounded-[1.5rem] bg-surface-variant animate-pulse"></div>

          {/* Badges */}
          <div className="mt-lg flex gap-md">
            <div className="h-8 w-24 bg-surface-variant animate-pulse rounded-full"></div>
            <div className="h-8 w-32 bg-surface-variant animate-pulse rounded-full"></div>
          </div>

          {/* Title & Meta */}
          <div className="h-10 w-3/4 bg-surface-variant animate-pulse rounded mt-md mb-xs"></div>
          <div className="h-5 w-1/2 bg-surface-variant animate-pulse rounded mb-lg"></div>

          {/* Description */}
          <div className="space-y-2 mb-2xl">
            <div className="h-4 w-full bg-surface-variant animate-pulse rounded"></div>
            <div className="h-4 w-full bg-surface-variant animate-pulse rounded"></div>
            <div className="h-4 w-5/6 bg-surface-variant animate-pulse rounded"></div>
          </div>

          {/* Products */}
          <div className="h-8 w-48 bg-surface-variant animate-pulse rounded mb-md"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-md">
            {[1, 2, 3].map((i) => (
              <div key={i} className="neumorphic-flat rounded-lg overflow-hidden border border-white/50 animate-pulse">
                <div className="h-32 w-full bg-surface-variant"></div>
                <div className="p-sm space-y-2">
                  <div className="h-4 w-3/4 bg-surface-variant rounded"></div>
                  <div className="h-3 w-1/2 bg-surface-variant rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="neumorphic-flat rounded-lg p-lg border border-white/50 h-fit sticky top-24 animate-pulse">
          <div className="h-8 w-3/4 bg-surface-variant rounded mb-md"></div>
          <div className="h-12 w-full bg-surface-variant rounded-full mb-md"></div>
          <div className="h-12 w-full bg-surface-variant rounded-full mb-md"></div>
          
          <div className="mt-lg pt-lg border-t border-outline-variant">
            <div className="h-4 w-5/6 bg-surface-variant rounded"></div>
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  );
}
