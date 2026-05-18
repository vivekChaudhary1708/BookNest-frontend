import { Link } from 'react-router-dom';
import { BookOpen, Target, Heart, Zap } from 'lucide-react';

const AboutPage = () => (
  <div className="bg-dark-bg">
    <div className="bg-hero-gradient py-20 px-4 text-center">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="relative max-w-3xl mx-auto">
        <h1 className="font-heading text-5xl font-bold text-dark-text mb-4">About <span className="text-gradient">BookNest</span></h1>
        <p className="text-dark-muted text-lg">India's most loved online bookstore — connecting readers with the books that matter.</p>
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="font-heading text-3xl font-bold text-dark-text">Our Story</h2>
          <p className="text-dark-muted leading-relaxed">BookNest was born from a simple belief: every person deserves access to great books. Founded in 2024, we set out to create a bookstore that feels as warm and welcoming as your favorite neighborhood library — but with the convenience of modern e-commerce.</p>
          <p className="text-dark-muted leading-relaxed">Today, we serve thousands of readers across India, offering over 50,000 titles across every genre imaginable.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[{ icon: BookOpen, label: '50K+', sub: 'Books Available' }, { icon: Target, label: '100K+', sub: 'Happy Readers' }, { icon: Heart, label: '4.8★', sub: 'Average Rating' }, { icon: Zap, label: '2-5 Days', sub: 'Delivery Time' }].map(({ icon: Icon, label, sub }) => (
            <div key={sub} className="card-hover p-5 text-center">
              <Icon className="w-7 h-7 text-primary-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-dark-text">{label}</p>
              <p className="text-xs text-dark-muted">{sub}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <Link to="/books" className="btn-primary btn-lg">Explore Our Collection</Link>
      </div>
    </div>
  </div>
);

export default AboutPage;
