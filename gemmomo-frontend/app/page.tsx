'use client';

import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>🎉 GEMMOMO에 오신 걸 환영합니다!</h1>
        <p>로그인하고 마이페이지에서 나만의 정보를 확인해보세요.</p>
      </section>
    </main>
  );
}