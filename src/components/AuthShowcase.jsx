import { BookOpen, Sparkles } from 'lucide-react';

const covers = [
  // OpenLibrary covers (reliable public CDN)
  { isbn: '9780140449136', title: 'The Odyssey' },
  { isbn: '9780061120084', title: 'To Kill a Mockingbird' },
  { isbn: '9780743273565', title: 'The Great Gatsby' },
  { isbn: '9780553213119', title: 'Dracula' },
  { isbn: '9780141439518', title: 'Pride and Prejudice' },
  { isbn: '9780060850524', title: 'Brave New World' },
];

const coverUrl = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;

export default function AuthShowcase() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dark-border bg-white shadow-card">
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute -top-20 -left-24 w-72 h-72 rounded-full bg-primary-500/18 blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-navy-500/18 blur-3xl animate-pulse-slow" />

      <div className="relative p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/25 bg-primary-500/10 px-3.5 py-1.5 text-xs font-semibold text-dark-text">
          <Sparkles className="w-3.5 h-3.5 text-primary-600" />
          Bright reads, smooth checkout
        </div>

        <h2 className="mt-4 font-heading text-3xl lg:text-4xl font-bold text-dark-text leading-tight">
          Discover books you’ll <span className="text-gradient">actually finish</span>.
        </h2>

        <p className="mt-3 text-sm lg:text-base text-dark-muted max-w-md">
          Handpicked collections, fast search, wishlist, cart, and orders — all in one clean experience.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3 lg:gap-4">
          {covers.map((c, idx) => (
            <div
              key={c.isbn}
              className={`group relative aspect-[2/3] overflow-hidden rounded-2xl border border-dark-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover animate-fade-in`}
              style={{ animationDelay: `${idx * 70}ms` }}
              title={c.title}
            >
              <img
                src={coverUrl(c.isbn)}
                alt={c.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                onError={(e) => {
                  // fallback to a simple gradient card if cover is missing
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 right-2 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                {c.title}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs text-dark-muted">
          <BookOpen className="w-4 h-4 text-navy-600" />
          Built with bright colors, subtle motion, and a white-first UI.
        </div>
      </div>
    </div>
  );
}

