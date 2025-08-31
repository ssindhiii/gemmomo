'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Nav() {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const decodeToken = (rawToken: string | null) => {
    if (!rawToken) return;
    try {
      const payload = JSON.parse(atob(rawToken.split('.')[1]));
      setIsAdmin(payload.is_admin === true || payload.is_admin === 1);
    } catch (err) {
      console.error('토큰 디코딩 실패:', err);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    decodeToken(storedToken);

    const handleLogin = () => {
      const updatedToken = localStorage.getItem('token');
      setToken(updatedToken);
      decodeToken(updatedToken);
    };

    window.addEventListener('login-success', handleLogin);
    return () => window.removeEventListener('login-success', handleLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAdmin(false);
    window.location.href = '/';
  };

  return (
    <nav className="nav">
      <div className="area logo"><Link className="nav_logo" href="/"><img src="/icon_logo.png" alt="" /></Link></div>
      <div className="area member">
        {token && <Link href="/users">
          <img src="/icon_mypage.svg" alt="" />
        </Link>}
          {isAdmin && <Link href="/admin/events">관리자</Link>}
          {!token ? (
            <Link href="/login">로그인</Link>
          ) : (
            <button onClick={handleLogout} className="text-blue-600 font-bold">
              로그아웃
            </button>
          )}
      </div>
    </nav>
  );
}
