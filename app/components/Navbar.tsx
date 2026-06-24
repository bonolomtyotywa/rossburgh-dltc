'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { logoutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/app/components/NotificationBell';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Bookings', href: '/bookings' },
  { label: 'Checklist', href: '/checklist' },
  { label: 'Queue', href: '/queue' },
  { label: 'Updates', href: '/updates' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Location', href: '/location' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  return (
    <nav className="bg-[#1E3A8A] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2">
          <div className="bg-white text-[#1E3A8A] font-bold text-sm px-2 py-1 rounded">DLTC</div>
          <span className="font-bold text-lg leading-tight">
            Rossburgh <span className="text-[#0EA5E9]">Portal</span>
          </span>
        </Link>

        {/* Desktop Nav — only show for non-admin */}
        {role !== 'admin' && (
          <ul className="hidden md:flex gap-6 text-sm font-medium">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href}
                  className="hover:text-[#0EA5E9] transition-colors duration-200">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Admin nav links */}
        {role === 'admin' && (
          <ul className="hidden md:flex gap-6 text-sm font-medium">
            <li><Link href="/admin" className="hover:text-[#0EA5E9] transition">Dashboard</Link></li>
            <li><Link href="/admin" className="hover:text-[#0EA5E9] transition">Bookings</Link></li>
            <li><Link href="/admin" className="hover:text-[#0EA5E9] transition">Announcements</Link></li>
            <li><Link href="/admin" className="hover:text-[#0EA5E9] transition">Queue</Link></li>
            <li><Link href="/admin" className="hover:text-[#0EA5E9] transition">Feedback</Link></li>
          </ul>
        )}

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {!loading && user && <NotificationBell />}
          {loading ? null : !user ? (
            <>
              <Link href="/login"
                className="text-sm font-semibold px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-[#1E3A8A] transition">
                Login
              </Link>
              <Link href="/admin"
                className="bg-[#0EA5E9] hover:bg-blue-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                Admin
              </Link>
            </>
          ) : role === 'admin' ? (
            <button onClick={handleLogout}
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition">
              Logout
            </button>
          ) : (
            <>
              <Link href="/dashboard"
                className="text-sm font-semibold px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-[#1E3A8A] transition">
                My Dashboard
              </Link>
              <button onClick={handleLogout}
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#162d6e] px-4 pb-4">
          <ul className="flex flex-col gap-3 text-sm font-medium pt-2">
            {role !== 'admin' && navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href}
                  className="block py-2 border-b border-blue-700 hover:text-[#0EA5E9]"
                  onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              {!user ? (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="block text-center py-2 rounded-lg border border-white font-semibold">
                    Login
                  </Link>
                  <Link href="/admin" onClick={() => setMenuOpen(false)}
                    className="block text-center py-2 rounded-lg bg-[#0EA5E9] font-semibold">
                    Admin
                  </Link>
                </div>
              ) : role === 'admin' ? (
                <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="block w-full text-center py-2 rounded-lg bg-red-500 font-semibold">
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                    className="block text-center py-2 rounded-lg border border-white font-semibold">
                    My Dashboard
                  </Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="block w-full text-center py-2 rounded-lg bg-red-500 font-semibold">
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}