import EventList from './components/EventList';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminEventsPage() {
  const res = await fetch('http://localhost:4000/api/events', { cache: 'no-store' });
  const events = await res.json();

  return (
    <main>
      <h1>관리자: 이벤트 목록</h1>
      <Link href="/admin/events/new">
        <button>새 이벤트 생성</button>
      </Link>
      <EventList events={events} />
    </main>
  );
}
