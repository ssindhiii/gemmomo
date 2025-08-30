'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem('token', token);

        // ✅ Nav.tsx에서 감지할 수 있도록 이벤트 발생
        window.dispatchEvent(new Event('login-success'));

        router.push('/');
      } else {
        const error = await res.json().catch(() => ({}));
        console.error('로그인 실패:', error?.error || '알 수 없는 오류');
      }
    } catch (err) {
      console.error('요청 실패:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold">로그인</h2>
      <input
        name="username"
        placeholder="아이디"
        onChange={handleChange}
        value={form.username}
        required
        className="border p-2 rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="비밀번호"
        onChange={handleChange}
        value={form.password}
        required
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-green-500 text-white py-2 rounded">
        로그인
      </button>
    </form>
  );
}
