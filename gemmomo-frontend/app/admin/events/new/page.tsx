'use client';

import EventForm from '../components/EventForm';


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function NewEventPage() {
  return (
    <main>
      <h1>새 이벤트 생성</h1>
      <EventForm
        method="POST"
        onSubmitUrl={`${apiUrl}/api/events`}
      />
    </main>
  );
}