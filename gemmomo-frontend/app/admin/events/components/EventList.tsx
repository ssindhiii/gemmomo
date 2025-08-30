'use client';

import { Event } from '../../../../types/event';
import { useRouter } from 'next/navigation';

interface Props {
  events: Event[];
}

export default function EventList({ events }: Props) {
  const router = useRouter();

  return (
    <ul>
      {events.map(evt => (
        <li key={evt.id}>
          {evt.title} ({evt.date})
          <button onClick={() => router.push(`/admin/events/${evt.id}`)}>수정 / 삭제</button>
        </li>
      ))}
    </ul>
  );
}
