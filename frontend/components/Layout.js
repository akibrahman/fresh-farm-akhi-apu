// frontend/components/Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AdminNavbar from './Admin/Admin-Nabvar';
import AdminFooter from './Admin/Admin-Footer';
import MyCarousel from './Admin/Carousel';  
import { useRouter } from 'next/router';
import HomePageProducts from './HomePageProducts';

const Layout = ({ children }) => {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');
  const isHomePage = router.pathname === '/';

  if (isAdminPage) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <main className="flex-grow">{children}</main>
        <AdminFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {isHomePage && <MyCarousel />} 
      {isHomePage && <HomePageProducts/>} {/* Render MyCarousel only on the home page */}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
