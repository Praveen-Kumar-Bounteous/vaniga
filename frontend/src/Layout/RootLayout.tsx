import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatBot from '@/Pages/Chatbot';
import { CookieBanner } from '@/Cookie/CookieBanner';

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      <Header />
      <CookieBanner
      />
      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default RootLayout;