'use client';

import Link from 'next/link';
import css from './Header.module.css';

import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isActive = pathname === '/';

  return (
    <header className={css.header}>
      <div className={css.container}>
        <div className={css.logo}>
          Travel<span className={css.logoRight}>Trucks</span>
        </div>

        <nav className={css.nav}>
          <Link href="/" className={isActive ? `${css.active}` : ''}>
            Home
          </Link>
          <Link href="/catalog" className={!isActive ? `${css.active}` : ''}>
            Catalog
          </Link>
        </nav>

        <div className={css.empty}></div>
      </div>
    </header>
  );
}
