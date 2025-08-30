// types/event.ts
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;       // ISO 문자열로 받습니다
  created_by: number;
}