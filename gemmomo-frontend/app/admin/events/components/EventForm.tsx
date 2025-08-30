'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '../../../../types/event';

interface Props {
  initial?: Partial<Event>;
  onSubmitUrl: string;
  method: 'POST' | 'PUT';
}

export default function EventForm({ initial = {}, onSubmitUrl, method }: Props) {
  const [title, setTitle] = useState(initial.title || '');
  const [date, setDate] = useState(initial.date || '');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch(onSubmitUrl, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date }),
    });
    router.push('/admin/events');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        제목
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </label>
      <label>
        날짜
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </label>
      <button type="submit">{method === 'POST' ? '생성' : '수정'}</button>
    </form>
  );
}
