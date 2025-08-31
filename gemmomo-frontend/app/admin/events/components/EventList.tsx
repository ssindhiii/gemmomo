'use client';

import { Event } from '../../../../types/event';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
interface Props {
  events: Event[];
}

export default function EventList({ events }: Props) {
  const router = useRouter();

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {events.map(evt => (
        <li key={evt.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
          {/* 이미지가 있을 경우에만 렌더링 */}
          {evt.image_pdf && (
            <img
              src={`http://localhost:4000/uploads/${evt.image_pdf}`}
              alt="이벤트 이미지"
              style={{ width: '200px', height: 'auto', marginBottom: '0.5rem', borderRadius: '8px' }}
            />
          )}
          <h3>{evt.title}</h3>
          <p>{new Date(evt.date).toLocaleDateString()}</p>
          <button onClick={() => router.push(`/admin/events/${evt.id}`)}>수정 / 삭제</button>
        </li>
      ))}
    </ul>
  );
}
