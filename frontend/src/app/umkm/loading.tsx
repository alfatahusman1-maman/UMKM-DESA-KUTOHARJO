import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoadingUmkmList() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="px-margin-mobile md:px-margin-desktop pt-2xl pb-lg mt-16">
        <div className="h-10 w-48 bg-surface-variant animate-pulse rounded mb-xs"></div>
        <div className="h-6 w-96 bg-surface-variant animate-pulse rounded mb-lg"></div>

        <div className="flex flex-col md:flex-row gap-md mb-lg">
          <div className="md:w-96 h-12 bg-surface-variant animate-pulse rounded-lg"></div>
          <div className="flex-1 flex gap-sm overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-24 bg-surface-variant animate-pulse rounded-lg flex-shrink-0"></div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-margin-mobile md:px-margin-desktop pb-3xl flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="neumorphic-flat rounded-lg overflow-hidden border border-white/50 flex flex-col animate-pulse">
              <div className="h-48 w-full bg-surface-variant"></div>
              <div className="p-md flex flex-col flex-1 gap-sm">
                <div className="h-6 w-3/4 bg-surface-variant rounded"></div>
                <div className="h-4 w-full bg-surface-variant rounded"></div>
                <div className="h-4 w-5/6 bg-surface-variant rounded"></div>
                <div className="mt-auto flex items-center gap-sm pt-md">
                  <div className="h-10 flex-1 bg-surface-variant rounded-full"></div>
                  <div className="h-10 w-24 bg-surface-variant rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
