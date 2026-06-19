export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <div className="shimmer h-8 w-28 rounded-xl mb-2" />
                <div className="shimmer h-4 w-52 rounded-lg" />
            </div>
            <div className="flex gap-2 mb-7">
                {[80, 96, 72, 88, 64].map(w => (
                    <div key={w} className="shimmer h-8 rounded-full" style={{ width: w }} />
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
                        <div className="shimmer aspect-[4/3]" />
                        <div className="p-5 space-y-3">
                            <div className="shimmer h-3 rounded-full w-1/4" />
                            <div className="shimmer h-4 rounded-full w-3/4" />
                            <div className="shimmer h-5 rounded-full w-1/3" />
                            <div className="shimmer h-3 rounded-full w-full" />
                            <div className="shimmer h-3 rounded-full w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
