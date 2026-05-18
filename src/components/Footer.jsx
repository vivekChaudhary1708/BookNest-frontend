import { Link } from 'react-router-dom';
import { BookMarked, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-card border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center">
                <BookMarked className="w-5 h-5 text-navy-700" />
              </div>
              <span className="font-heading font-bold text-xl text-dark-text">
                Book<span className="text-gradient">Nest</span>
              </span>
            </Link>
            <p className="text-dark-muted text-sm leading-relaxed">
              Your premium online bookstore. Discover, explore, and own the books that shape minds and inspire souls.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-dark-border/50 flex items-center justify-center text-dark-muted hover:text-primary-400 hover:bg-primary-500/10 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-dark-text mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Browse Books',  to: '/books' },
                { label: 'My Orders',     to: '/orders' },
                { label: 'Wishlist',      to: '/wishlist' },
                { label: 'My Cart',       to: '/cart' },
                { label: 'Profile',       to: '/profile' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-dark-muted hover:text-primary-400 flex items-center gap-2 transition-colors group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-dark-text mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {['Fiction','Non-Fiction','Technology','Science','Biography','Self-Help','Mystery','Romance'].map((cat) => (
                <li key={cat}>
                  <Link to={`/books?category=${cat}`} className="text-sm text-dark-muted hover:text-primary-400 flex items-center gap-2 transition-colors group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-dark-text mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-dark-muted">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span>123 Book Street, Knowledge Park, Mumbai 400001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-dark-muted">
                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-dark-muted">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>hello@booknest.in</span>
              </li>
            </ul>

            {/* Newsletter mini */}
            <div className="mt-4">
              <p className="text-xs text-dark-muted mb-2">Subscribe to our newsletter</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="your@email.com" className="input text-xs py-2 px-3" />
                <button type="submit" className="btn-primary btn-sm whitespace-nowrap">Go</button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-dark-muted">
            © {new Date().getFullYear()} BookNest. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-dark-muted">
            <Link to="/about"   className="hover:text-primary-400 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
