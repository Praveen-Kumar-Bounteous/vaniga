import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      <Header />
      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;