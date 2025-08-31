// app/page.tsx
import EventCard from '../components/EventCard';
import styles from './page.module.css';
import { Event } from '../types/event';

export const revalidate = 0; // 매 요청마다 최신 데이터를 받습니다
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function fetchEvents(): Promise<Event[]> {
  // 1) 동작하는 절대경로로 바꿔보기
  const res = await fetch(`${apiUrl}/api/events`, { cache: 'no-store' });

  console.log('status:', res.status);
  if (!res.ok) {
    throw new Error(`이벤트 로드 실패: ${res.status}`);
  }
  return res.json();
}

export default async function HomePage() {
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  let events: Event[] = [];

  try {
    events = await fetchEvents();
  } catch (err) {
    console.error(err);
    return <p className={styles.error}>이벤트를 불러오지 못했습니다.</p>;
  }

  return (
    <main className="cardnews">
      {events.length === 0 ? (
        <p>등록된 이벤트가 없습니다.</p>
      ) : (
        <ul>
          {events.map(evt => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </ul>
      )}
    </main>
  );
}