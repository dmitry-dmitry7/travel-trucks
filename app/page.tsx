import Link from 'next/link';
import css from './Home.module.css';

export default function HomePage() {
  return (
    <main className={css.hero}>
      <div className={css.overlay}>
        <h1>Campers of your dreams</h1>

        <p>You can find everything you want in our catalog</p>

        <Link href="/catalog" className={css.button}>
          View Now
        </Link>
      </div>
    </main>
  );
}
