// app/admin/events/[id]/UpdateEvent.tsx
'use client';

import { useRouter } from 'next/navigation';
import EventForm from '../components/EventForm';
import { useEffect } from 'react';

interface Props {
  initial: any;
  id: string;
}

export default function UpdateEvent({ initial, id }: Props) {
  const router = useRouter();

  useEffect(() => {
    console.log('📌 Client-side received id:', id);
  }, [id]);

  const handleDelete = async () => {
    await fetch(`http://localhost:4000/api/events/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    router.push('/admin/events');
  };

  return (
    <>
      <EventForm
        initial={initial}
        method="PUT"
        onSubmitUrl={`http://localhost:4000/api/events/${id}`}
      />
      <button onClick={handleDelete}>삭제하기</button>
    </>
  );
}
