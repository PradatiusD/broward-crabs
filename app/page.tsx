import styles from "./page.module.css";
import MapComponent from "./map";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <MapComponent />
        <p>Under Construction for Broward Crabs</p>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
