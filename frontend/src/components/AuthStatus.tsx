'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { apiUrl, getCsrfToken } from '@/lib/api';

type AuthUser = {
  id: number;
  name: string;
};

type AuthState = 
  | { status: 'loading'}
  | { status: 'guest'}
  | { status: 'authenticated'; user: AuthUser }
  | { status: 'error'};

  export default function AuthStatus() {
    const [auth, setAuth] = useState<AuthState>({ status: 'loading' });

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState('');
    const logoutRef = useRef(false);

    useEffect(() => {
      const controller = new AbortController();

      async function loadUser() {
        try {
          const response = await fetch(apiUrl('/api/user'), {
            headers: {
              Accept: 'application/json',
            },
            credentials: 'include',
            cache: 'no-store',
            signal: controller.signal,
          });

          if (controller.signal.aborted) {
            return;
          }

          if (response.status === 401) {
            setAuth({ status: 'guest' });
            return;
          }

          if (!response.ok) {
            throw new Error(`ユーザー取得に失敗しました (HTTP ${response.status})`);
          }

          const user: AuthUser = await response.json();

          if (!controller.signal.aborted) {
            setAuth({ status: 'authenticated', user });
          }
        } catch (error) {
          if (!controller.signal.aborted) {
            console.error(`ログイン状態の取得エラー`, error);
            setAuth({ status: 'error'});
          }
        }
      }

      void loadUser();
      return () => controller.abort();
    }, []);

      async function handleLogout() {
        if (logoutRef.current) {
          return;
        }

        logoutRef.current = true;
        setIsLoggingOut(true);
        setLogoutError('');

        try {
          const csrfToken = await getCsrfToken();

          const response = await fetch(apiUrl('/logout'), {
            method: 'POST',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'X-XSRF-TOKEN': csrfToken,
            },
          });

          //既にセッションが切れている場合も未ログイン表示
          if (response.status === 401) {
            setAuth({ status: 'guest' });
            return;
          }

          if (!response.ok) {
            throw new Error(
              `ログアウトに失敗しました (HTTP ${response.status})`,
            );
          }

          setAuth({ status: 'guest' });
        } catch (error) {
          console.error ('ログアウトエラー', error);
          setLogoutError('ログアウトできませんでした。もう一度お試しください。');
        } finally {
          logoutRef.current = false;
          setIsLoggingOut(false);
        }
      }

      if (auth.status === 'loading') {
    return (
      <p role='status' className='text-center text-sm text-white/70'>
        ログイン状態を確認中…
      </p>
    );
  }

  if (auth.status === 'error') {
    return (
      <p role='alert' className='text-center text-sm text-white'>
        ログイン状態を取得できませんでした。
      </p>
    );
  }

  if (auth.status === 'guest') {
    return (
      <Link
        href='/login'
        className='block rounded-lg px-3 py-2 text-center font-semibold hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
      >
        ログイン
      </Link>
    );
  }

  return (
    <div className="rounded-xl bg-black/20 p-3 text-center">
      <p className="text-xs text-white/20">ログイン中</p>

      <p className="mt-1 break-words text-sm font-semibold">
        {auth.user.name}
      </p>

      {logoutError && (
        <p role="alert" className="mt-3 text-sm text-white">
          {logoutError}
        </p>
      )}

      <button 
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className='mt-3 w-full rounded-lg border border-white/30 px-3 py-2 text-sm font-semibold hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-60'
        >
          {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
        </button>
    </div>
  );
}