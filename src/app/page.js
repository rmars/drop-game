import styles from "./page.module.css";
import DropGame from "./drop-game.js";

export default function Home() {
  return (
    <main className={styles.main}>
      <DropGame />
    </main>
  );
}
