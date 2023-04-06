import { host, site } from '@/lib/config';
import Link from 'next/link';
import { Github, RSS, Twitter } from './Icons';
import styles from './styles.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        <p>
          2019 - {new Date().getFullYear()} © <b>KAI CHI</b>.
        </p>
      </div>
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
        <Link
          className={styles.footerLink}
          target='_blank'
          href={`${host}/feed.xml`}
        >
          <RSS />
        </Link>
      </div>
    </footer>
  );
}
