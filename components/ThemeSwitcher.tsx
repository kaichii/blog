import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "./Icons";
import styles from "./styles.module.css";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);

  const { setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <span className={styles.toggleButtonWrapper}>
      <button
        data-hide-on-theme='light'
        title='切换主题（当前：dark）'
        aria-label='切换主题（当前：dark）'
        className={styles.toggleButton}
        onClick={() => (!mounted ? void 0 : setTheme("light"))}
      >
        <Sun />
      </button>
      <button
        data-hide-on-theme='dark'
        title='切换主题（当前：light）'
        aria-label='切换主题（当前：light）'
        className={styles.toggleButton}
        onClick={() => (!mounted ? void 0 : setTheme("dark"))}
      >
        <Moon />
      </button>
    </span>
  );
}
