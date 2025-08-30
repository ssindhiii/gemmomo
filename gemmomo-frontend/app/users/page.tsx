// app/users/page.tsx
'use client';

import { useEffect, useState } from 'react';

type User = {
  id: number;
  username: string;
  email?: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ 회원 목록 불러오기 실패:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>회원 목록</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} {user.email && `(${user.email})`}
          </li>
        ))}
      </ul>
    </div>
  );
}