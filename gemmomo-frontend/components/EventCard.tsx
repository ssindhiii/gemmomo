'use client';

import { Event } from '../types/event';
import styles from './EventCard.module.css';

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const formattedDate = new Date(event.date).toLocaleDateString();

  return (
      <li className={styles.card}>
        {/* 이미지가 있을 경우에만 렌더링 */}
        <div className="img_area">
          {event.image_pdf && (
            <img
              src={`http://localhost:4000/uploads/${event.image_pdf}`}
              alt="이벤트 이미지"
              className={styles.image}
            />
          )}
        </div>
        <div className="text_area">
          <h2 className={styles.title}>{event.title}</h2>
          <p className={styles.date}>{formattedDate}</p>
          <p className={styles.description}>{event.description}</p>
        </div>
      </li>
  );
}