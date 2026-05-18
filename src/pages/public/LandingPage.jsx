import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  Search, ArrowRight, Star, TrendingUp, Award, BookOpen,
  Zap, Shield, Truck, Headphones, ChevronRight, Quote
} from 'lucide-react';
import { fetchProducts, selectBooks, selectBooksLoading } from '../../redux/slices/bookSlice';
import BookCard from '../../components/BookCard';
import { PageLoader } from '../../components/Loader';
import { BOOK_CATEGORIES } from '../../utils/constants';
import { MOCK_BOOKS } from '../../utils/mockBooks';

const categoryIcons = ['📚','💡','🔬','💻','🏛️','👤','🧘','❤️','🔍','⚡'];

const testimonials = [
  { name: 'Priya Sharma',   role: 'Software Engineer', rating: 5, text: 'BookNest has an incredible collection. Found rare tech books that were unavailable elsewhere. Fast delivery and great packaging!', avatar: 'PS' },
  { name: 'Rahul Mehta',    role: 'Student',            rating: 5, text: 'The UI is so clean and smooth. I love how easy it is to find books by category. My go-to bookstore!', avatar: 'RM' },
  { name: 'Ananya Gupta',   role: 'Writer',             rating: 4, text: 'Amazing wishlist feature! I save books I want to read later and come back to buy them. Highly recommend BookNest.', avatar: 'AG' },
  { name: 'Kiran Patel',    role: 'Professor',          rating: 5, text: 'Superb academic book collection. Got all my course books in one place. Student discounts are a huge bonus!', avatar: 'KP' },
];

const features = [
  { icon: Truck,      title: 'Fast Delivery',    desc: 'Get your books delivered within 2-5 business days across India.' },
  { icon: Shield,     title: 'Secure Payments',  desc: 'Your transactions are fully protected with bank-grade security.' },
  { icon: Headphones, title: '24/7 Support',     desc: 'Our support team is always here to help you anytime, anywhere.' },
  { icon: Zap,        title: 'Best Prices',      desc: 'Exclusive deals and discounts on thousands of bestselling books.' },
];

const rotateBooks = (list, start, count) => {
  if (!list.length) return [];
  const normalized = start % list.length;
  return [...list.slice(normalized), ...list.slice(0, normalized)].slice(0, Math.min(count, list.length));
};

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredStart, setFeaturedStart] = useState(0);
  const [trendingStart, setTrendingStart] = useState(0);
  const [bestStart, setBestStart] = useState(0);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const books     = useSelector(selectBooks);
  const isLoading = useSelector(selectBooksLoading);

  useEffect(() => { dispatch(fetchProducts({})); }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const displayBooks = books.length >= 10 ? books : MOCK_BOOKS;
  const heroBooks = MOCK_BOOKS.slice(0, 4);
  const featured = rotateBooks(displayBooks, featuredStart, 10);
  const trending = rotateBooks([...displayBooks.slice(4), ...displayBooks.slice(0, 4)], trendingStart, 10);
  const bestSell = rotateBooks([...displayBooks].reverse(), bestStart, 10);

  return (
    <div className="bg-dark-bg">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center bg-hero-gradient overflow-hidden">
        {/* Mesh background */}
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        {/* Floating decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
              <TrendingUp className="w-4 h-4 text-primary-500" />
              <span className="text-sm text-primary-400 font-medium">#1 Online Bookstore in India</span>
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-dark-text leading-tight">
              Discover Your
              <span className="block text-gradient">Next Great</span>
              <span className="block">Read</span>
            </h1>

            <p className="text-lg text-dark-muted leading-relaxed max-w-lg">
              Explore over 50,000 books across every genre. From bestsellers to hidden gems —
              find the book that changes your world.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="relative max-w-xl">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, author, or category..."
                    className="input pl-12 py-4 text-base"
                  />
                </div>
                <button type="submit" className="btn-primary btn-lg px-6">
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-6 text-sm text-dark-muted">
              <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary-500" /> 50K+ Books</span>
              <span className="flex items-center gap-2"><Star className="w-4 h-4 text-primary-500" /> 4.8/5 Rating</span>
              <span className="flex items-center gap-2"><Award className="w-4 h-4 text-primary-500" /> Free Shipping above ₹500</span>
            </div>
          </div>

          {/* Right — floating book cards */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="grid grid-cols-2 gap-4 transform rotate-3">
              {heroBooks.map((book, i) => (
                <div
                  key={book.id}
                  className="glass-card p-3 rounded-xl hover:-translate-y-2 transition-all duration-500"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <img
                    src={book.imageUrl || `https://placehold.co/160x220/1E293B/F59E0B?text=${encodeURIComponent(book.title?.charAt(0) || 'B')}`}
                    alt={book.title}
                    className="w-full h-36 object-cover rounded-lg"
                    onError={(e) => { e.target.src = `https://placehold.co/160x220/1E293B/F59E0B?text=B`; }}
                  />
                  <p className="text-dark-text text-xs font-semibold mt-2 line-clamp-2">{book.title}</p>
                  <p className="text-primary-400 text-xs font-bold mt-1">₹{book.discountPrice || book.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-navy-700" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── Popular Categories ──────────────────────────────────────────── */}
      <section className="section">
        <div className="container-max">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-dark-text mb-3">Browse by Category</h2>
            <p className="text-dark-muted">Explore our vast collection across all genres</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {BOOK_CATEGORIES.slice(0, 10).map((cat, i) => (
              <Link
                key={cat}
                to={`/books?category=${cat}`}
                className="card-hover p-4 flex flex-col items-center gap-3 text-center group"
              >
                <span className="text-3xl">{categoryIcons[i]}</span>
                <span className="text-sm font-medium text-dark-muted group-hover:text-primary-400 transition-colors">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Books ─────────────────────────────────────────────── */}
      <section className="section bg-dark-card/30">
        <div className="container-max">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-3xl font-bold text-dark-text mb-1">Featured Books</h2>
              <p className="text-dark-muted text-sm">Hand-picked by our expert curators</p>
            </div>
            <Link to="/books" className="btn-outline btn-sm hidden sm:flex items-center gap-2">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {isLoading ? <PageLoader /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {featured.length > 0 ? featured.map((b) => <BookCard key={b.id} book={b} />)
                : Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="card aspect-[3/4] skeleton" />
                  ))
              }
            </div>
          )}
          <div className="text-center mt-6 sm:hidden">
            <Link to="/books" className="btn-outline">View All Books</Link>
          </div>
        </div>
      </section>

      {/* ── Trending Books ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-max">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                <h2 className="font-heading text-3xl font-bold text-dark-text">Trending Now</h2>
              </div>
              <p className="text-dark-muted text-sm">What everyone is reading this week</p>
            </div>
            <Link to="/books?sort=trending" className="btn-outline btn-sm hidden sm:flex items-center gap-2">
              See Trends <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {isLoading ? <PageLoader /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {trending.length > 0 ? trending.map((b) => <BookCard key={b.id} book={b} />)
                : featured.map((b) => <BookCard key={b.id} book={b} />)
              }
            </div>
          )}
        </div>
      </section>

      {/* ── Best Sellers ──────────────────────────────────────────────── */}
      <section className="section bg-dark-card/30">
        <div className="container-max">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-5 h-5 text-primary-500" />
                <h2 className="font-heading text-3xl font-bold text-dark-text">Best Sellers</h2>
              </div>
              <p className="text-dark-muted text-sm">Most loved books of all time</p>
            </div>
          </div>
          {isLoading ? <PageLoader /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {bestSell.map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-dark-text mb-3">Why Choose BookNest?</h2>
            <p className="text-dark-muted max-w-xl mx-auto">We're committed to bringing you the best book shopping experience in India.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-hover p-6 text-center group">
                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary-500" />
                </div>
                <h3 className="font-semibold text-dark-text mb-2">{title}</h3>
                <p className="text-sm text-dark-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="section bg-dark-card/30">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-dark-text mb-3">What Our Readers Say</h2>
            <p className="text-dark-muted">Thousands of happy readers can't be wrong</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map(({ name, role, rating, text, avatar }) => (
              <div key={name} className="card-hover p-6 space-y-4">
                <Quote className="w-6 h-6 text-primary-500/50" />
                <p className="text-sm text-dark-muted leading-relaxed italic">"{text}"</p>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary-500 text-primary-500" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-navy-700 font-bold text-sm">{avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-dark-text">{name}</p>
                    <p className="text-xs text-dark-muted">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ──────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-max">
          <div className="relative rounded-3xl overflow-hidden bg-hero-gradient border border-primary-500/20 p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-mesh pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark-text">
                Stay Updated with <span className="text-gradient">BookNest</span>
              </h2>
              <p className="text-dark-muted">
                Subscribe for exclusive deals, new arrivals, and curated reading lists delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email address" className="input flex-1" />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Subscribe <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-xs text-dark-muted">No spam, unsubscribe anytime. 📚</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
