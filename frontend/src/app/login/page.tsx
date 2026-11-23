'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl, getCsrfToken } from '@/lib/api';
import Image from 'next/image';
import SidebarLayout from '@/components/SidebarLayout';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const submittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch(apiUrl('/login'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if(response.status === 422) {
        setErrorMessage(
          'メールアドレスまたはパスワードを確認してください。',
        );
        return;
      }

      if(response.status === 419) {
        setErrorMessage(
          'セッションの有効期限が切れました。もう一度ログインしてください。',
        );
        return;
      }

      if(!response.ok) {
        throw new Error(`ログインに失敗しました (HTTP ${response.status})`);
      }

      router.replace('/courses');
    } catch (error) {
      console.error('ログインエラー', error);
      setErrorMessage(
        'ログインできませんでした。通信環境を確認して、もう一度お試しください。',
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <SidebarLayout className='bg-white px-5 py-10 text-slate-900 sm:px-10 lg:px-16'>
      <section
        aria-labelledby='login-title'
        className='mx-auto w-full max-w-2xl'
      >
        <div className="flex items-center justify-center gap-3">
          <Image
            src='/images/logo-no-title.png'
            alt=''
            width={56}
            height={56}
            className='h-12 w-12 rounded-xl sm:h-14 sm:w-14'
          />

          <span className="text-xl font-medium tracking-tight sm:text-3xl">
            Elephant English
          </span>
        </div>

        <h1 className="mt-5 text-center text-3xl font-extrabold tracking-tight sm:text-4xl" id="login-title">
          Welcome back!
        </h1>

        <p className="mt-3 text-center text-sm leading-relaxed text-slate-600 sm:text-base">
          Log in to continue your English learning.
        </p>

        <form
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
          className='mt-10 space-y-6'
        >
          <div>
            <label 
              htmlFor="email"
              className='block text-base font-medium'>
                Email Address
            </label>

            <input 
              type="email"
              id='email'
              name='email'
              autoComplete='username'
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className='mt-3 min-h-12 w-full rounded-lg border border-slate-400 bg-white px-4 py-3 text-base transition-colors focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-200' 
            />
          </div>

          <div>
            <label 
              htmlFor="password"
              className='block text-base font-medium'
            >
              Password
            </label>

            <input 
              type="password"
              id='password'
              name='password'
              autoComplete='current-password'
              required 
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className='mt-3 min-h-12 w-full rounded-lg border border-slate-400 bg-white px-4 py-3 text-base transition-colors focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-200'
            />
          </div>

          {errorMessage && (
            <p
              role='alert'
              className='rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700'
            >
              {errorMessage}
            </p>
          )}

          <button
           type='submit'
           disabled={isSubmitting}  
           className='min-h-12 w-full rounded-lg bg-violet-600 px-4 py-3 text-base font-bold text-white transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="my-9 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-300" aria-hidden="true" />
          <span className="shrink-0 text-sm text-slate-500">
            or continue with
          </span>
          <div aria-hidden='true' className='h-px flex-1 bg-slate-300' />
        </div>

        <div className="space-y-4">
          {[
            { name: 'Apple', image: '/images/auth/apple.png'  },
            { name: 'Google', image: '/images/auth/google.jpeg'  },
          ].map((provider) => (
            <button
              key={provider.name}
              type='button'
              disabled
              className='grid min-h-14 w-full cursor-not-allowed grid-cols-[28px_1fr_auto] items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 sm::px-6'
            >
              <Image
                src={provider.image}
                alt=''
                width={28}
                height={28}
                className='h-7 w-7 object-contain'
              />

              <span className="text-center text-sm sm:text-base">
                Continue with {provider.name}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
                準備中
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
          <span className="text-slate-600">
            Don&apos;t have an account?
          </span>

          <Link
            href='/register'
            className='rounded px-2 py-2 font-bold text-violet-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500'
          >
            Sign up
          </Link>
        </div>
      </section>
    </SidebarLayout>
    );
  }
    