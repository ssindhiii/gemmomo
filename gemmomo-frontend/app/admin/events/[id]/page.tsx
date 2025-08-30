// app/admin/events/[id]/page.tsx

import { notFound } from 'next/navigation';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

interface PageProps {
  // Next.js 15+ passes params as a Promise
  params: Promise<{ id: string }>;
}

export default async function EventDetail({ params }: PageProps) {
  // await the params API before using
  const { id } = await params;

  // 백엔드 주소 (환경변수 또는 기본값)
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:4000';

  // 외부 API 호출 (캐시 방지)
  const res = await fetch(`${baseUrl}/api/events/${id}`, {
    cache: 'no-store',
  });

  // 404 페이지로 포워딩
  if (res.status === 404) {
    notFound();
  }

  // 그 외 실패 처리
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API 요청 실패 [${res.status}]: ${text}`);
  }

  // 정상 응답 JSON 파싱
  const eventData: Event = await res.json();

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
        {eventData.title}
      </h1>
      <p style={{ color: '#666' }}>
        {new Date(eventData.date).toLocaleDateString()}
      </p>
      <p style={{ fontStyle: 'italic' }}>{eventData.location}</p>
      <section style={{ marginTop: '1.5rem', lineHeight: 1.6 }}>
        {eventData.description}
      </section>
    </main>
  );
}
