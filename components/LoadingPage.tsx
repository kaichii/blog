import { LoadingIcon } from './Icons';
import styles from './styles.module.css';

export default function LoadingPage() {
  return (
    <p className={styles.container}>
      <LoadingIcon />
    </p>
  );
}
