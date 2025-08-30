// components/EventCard.tsx
'use client';

import { Event } from '../types/event';
import styles from './EventCard.module.css';

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const formattedDate = new Date(event.date).toLocaleDateString();

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{event.title}</h2>
      <p className={styles.date}>{formattedDate}</p>
      <p className={styles.description}>{event.description}</p>
    </div>
  );
}