'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert('로그인 성공!');
      localStorage.setItem('token', data.token); // 토큰 저장
    } else {
      alert(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="username" placeholder="아이디" onChange={handleChange} />
      <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} />
      <button type="submit">로그인</button>
    </form>
  );
}