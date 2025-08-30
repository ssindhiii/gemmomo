'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const router = useRouter();

  const [user, setUser] = useState({ username: '', email: '', is_admin: false });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [password, setPassword] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          alert('사용자 정보를 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('요청 실패:', err);
        alert('서버 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setUpdating(true);

    const payload = {
      username: user.username,
      email: user.email,
      ...(password && { password }), // 비밀번호가 입력된 경우에만 포함
    };

    try {
      const res = await fetch('http://localhost:4000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('정보가 수정되었습니다.');
        setEditMode(false);
        setPassword('');
      } else {
        alert('수정 실패');
      }
    } catch (err) {
      console.error('수정 요청 실패:', err);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10">로딩 중...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold">내 정보</h2>

      <label>이름</label>
      <input
        name="username"
        value={user.username}
        onChange={handleChange}
        disabled={!editMode}
        className="border px-2 py-1 w-full"
      />

      <label>이메일</label>
      <input
        name="email"
        value={user.email}
        onChange={handleChange}
        disabled={!editMode}
        className="border px-2 py-1 w-full"
      />

      <label>권한</label>
      <input
        value={Boolean(user.is_admin) ? '관리자' : '일반 사용자'}
        disabled
        className="border px-2 py-1 w-full bg-gray-100"
      />

      {editMode && (
        <>
          <label>비밀번호 변경 (선택)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호"
            className="border px-2 py-1 w-full"
          />
        </>
      )}

      {editMode ? (
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {updating ? '저장 중...' : '저장하기'}
        </button>
      ) : (
        <button onClick={() => setEditMode(true)} className="bg-gray-500 text-white py-2 px-4 rounded">
          수정하기
        </button>
      )}
    </div>
  );
}
