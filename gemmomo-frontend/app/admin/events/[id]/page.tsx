'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EventForm from '../components/EventForm';
import { Event } from '../../../../types/event';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const router = useRouter();
  const params = useParams(); // 👈 여기서 params 가져오기
  
  

  useEffect(() => {
    if (!params?.id) return;

    fetch(`${apiUrl}/api/events/${params.id}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setEvent(data));
  }, [params?.id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('정말로 이 이벤트를 삭제하시겠습니까?');
    if (!confirmed) return;

    const res = await fetch(`${apiUrl}/api/events/${params.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('이벤트가 삭제되었습니다.');
      router.push('/admin/events');
    } else {
      alert('삭제에 실패했습니다.');
    }
  };

  if (!event) return <p>이벤트 정보를 불러오는 중...</p>;

  return (
    <main>
      <h1>이벤트 상세 / 수정</h1>
      <EventForm
        initial={event}
        onSubmitUrl={`${apiUrl}/api/events/${params.id}`}
        method="PUT"
      />
      <button onClick={handleDelete} style={{ marginTop: '20px', backgroundColor: 'red', color: 'white' }}>
        이벤트 삭제
      </button>
    </main>
  );
}
