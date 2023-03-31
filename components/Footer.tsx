import Link from 'next/link';
import { Github, Twitter } from './Icons';
import styles from './styles.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <Link
          className={styles.footerLink}
          target='_blank'
          href='https://github.com/kaichii'
        >
          <Github />
        </Link>
        <Link
          className={styles.footerLink}
          target='_blank'
          href='https://twitter.com/k41chi'
        >
          <Twitter />
        </Link>
      </div>
      <div className={styles.copyright}>
        <p>© {new Date().getFullYear()} KAI CHI.</p>
      </div>
    </footer>
  );
}
