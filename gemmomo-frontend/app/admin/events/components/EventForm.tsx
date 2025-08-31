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
  const [description, setDescription] = useState(initial.description || '');
  const [location, setLocation] = useState(initial.location || '');
  const [tags, setTags] = useState(initial.tags || '');
  const [imagePdfFile, setImagePdfFile] = useState<File | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('date', date);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('tags', tags);

    if (imagePdfFile) {
      formData.append('image_pdf', imagePdfFile);
    }

    await fetch(onSubmitUrl, {
      method,
      body: formData,
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
      <label>
        설명
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </label>
      <label>
        장소
        <input value={location} onChange={e => setLocation(e.target.value)} />
      </label>
      <label>
        태그
        <input value={tags} onChange={e => setTags(e.target.value)} />
      </label>
      <label>
        이미지/PDF 업로드
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) setImagePdfFile(file);
          }}
        />
      </label>
      <button type="submit">{method === 'POST' ? '생성' : '수정'}</button>
    </form>
  );
}
