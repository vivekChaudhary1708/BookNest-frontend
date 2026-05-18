import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CustomerLayout = () => (
  <div className="min-h-screen flex flex-col bg-dark-bg">
    <Navbar />
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default CustomerLayout;
