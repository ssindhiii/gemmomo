// app/admin/events/new/page.tsx

import EventForm from '../components/EventForm';

export const revalidate = 0;

export default function NewEventPage() {
  return (
    <main>
      <h1>새 이벤트 생성</h1>
      <EventForm
        method="POST"
        onSubmitUrl="http://localhost:4000/api/events"
      />
    </main>
  );
}