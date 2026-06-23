'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Home',      href: '/' },
  { label: 'Services',  href: '/services' },
  {label: 'Bookings',  href: '/bookings' },
  { label: 'Checklist', href: '/checklist' },
  { label: 'Queue',     href: '/queue' },
  { label: 'Updates',   href: '/updates' },
  { label: 'Feedback',  href: '/feedback' },
  { label: 'Location',  href: '/location' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#1E3A8A] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-white text-[#1E3A8A] font-bold text-sm px-2 py-1 rounded">
            DLTC
          </div>
          <span className="font-bold text-lg leading-tight">
            Rossburgh <span className="text-[#0EA5E9]">Portal</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-[#0EA5E9] transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Admin Button (Desktop) */}
        <Link
          href="/admin"
          className="hidden md:block bg-[#0EA5E9] hover:bg-blue-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          Admin
        </Link>

        {/* Hamburger (Mobile) */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#162d6e] px-4 pb-4">
          <ul className="flex flex-col gap-3 text-sm font-medium pt-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 border-b border-blue-700 hover:text-[#0EA5E9]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/admin"
                className="block mt-2 bg-[#0EA5E9] text-center py-2 rounded-lg font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Admin Panel
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}