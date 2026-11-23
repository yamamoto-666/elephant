'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SidebarLayout from '@/components/SidebarLayout';
import { apiUrl, getCsrfToken } from '@/lib/api';

type FieldName = 'name' | 'email' | 'password' | 'password_confirmation';

type ValidationResponse = {
  errors?: Partial<Record<FieldName, string[]>>;
};

const inputClassName =
  'mt-3 min-h-12 w-full rounded-lg border border-slate-400 bg-white px-4 py-3 text-base focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-200';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] =
    useState<ValidationResponse['errors']>({});
  const submittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current || isRegistered) {
      return;
    }

    setErrorMessage('');
    setFieldErrors({});

    if (password !== passwordConfirmation) {
      setFieldErrors({
        password_confirmation: ['確認用パスワードが一致しません。'],
      });
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch(apiUrl('/register'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      if (response.status === 422) {
        const result: ValidationResponse = await response.json();
        setFieldErrors(result.errors ?? {});
        setErrorMessage('入力内容を確認してください。');
        return;
      }

      if (response.status === 419) {
        setErrorMessage(
          'セッションの有効期限が切れました。もう一度お試しください。',
        );
        return;
      }

      if (!response.ok) {
        throw new Error(`登録に失敗しました（HTTP ${response.status}）`);
      }

      setPassword('');
      setPasswordConfirmation('');
      setIsRegistered(true);
    } catch (error) {
      console.error('登録エラー', error);
      setErrorMessage(
        '登録を完了できませんでした。通信環境を確認してください。',
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  const fields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      autoComplete: 'name',
      value: name,
      update: setName,
      maxLength: 255,
    },
    {
      id: 'email',
      label: 'Email address',
      type: 'email',
      autoComplete: 'email',
      value: email,
      update: setEmail,
      maxLength: 255,
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      autoComplete: 'new-password',
      value: password,
      update: setPassword,
      minLength: 8,
    },
    {
      id: 'password_confirmation',
      label: 'Confirm password',
      type: 'password',
      autoComplete: 'new-password',
      value: passwordConfirmation,
      update: setPasswordConfirmation,
      minLength: 8,
    },
  ] as const;

  return (
    <SidebarLayout className='bg-white px-5 py-10 text-slate-900 sm:px-10 lg:px-16'>
      <section
        aria-labelledby='register-title'
        className='mx-auto w-full max-w-2xl'
      >
        <div className='flex items-center justify-center gap-3'>
          <Image
            src='/images/logo-no-title.png'
            alt=''
            width={56}
            height={56}
            className='h-12 w-12 rounded-xl sm:h-14 sm:w-14'
          />
          <span className='text-xl font-medium sm:text-3xl'>
            Elephant English
          </span>
        </div>

        <h1
          id='register-title'
          className='mt-5 text-center text-3xl font-extrabold tracking-tight sm:text-4xl'
        >
          Create your account
        </h1>

        <p className='mt-3 text-center text-sm text-slate-600 sm:text-base'>
          Start your English journey today.
        </p>

        {isRegistered ? (
          <div className='mt-10 text-center'>
            <p
              role='status'
              className='rounded-lg bg-green-50 p-4 text-green-800'
            >
              アカウントを作成しました。ログインして学習を始めましょう。
            </p>
            <Link
              href='/login'
              className='mt-6 block rounded-lg bg-violet-600 px-4 py-3 font-bold text-white hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2'
            >
              Log in
            </Link>
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              aria-busy={isSubmitting}
              className='mt-10 space-y-6'
            >
              {fields.map((field) => {
                const messages = fieldErrors?.[field.id];

                return (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className='block text-base font-medium'
                    >
                      {field.label}
                    </label>

                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      required
                      minLength={
                        'minLength' in field ? field.minLength : undefined
                      }
                      maxLength={
                        'maxLength' in field ? field.maxLength : undefined
                      }
                      value={field.value}
                      onChange={(event) => field.update(event.target.value)}
                      aria-invalid={Boolean(messages?.length)}
                      aria-describedby={
                        messages?.length ? `${field.id}-error` : undefined
                      }
                      className={inputClassName}
                    />

                    {messages?.length ? (
                      <p
                        id={`${field.id}-error`}
                        className='mt-2 text-sm text-red-700'
                      >
                        {messages.join(' ')}
                      </p>
                    ) : null}
                  </div>
                );
              })}

              <p className='text-sm text-slate-500'>
                パスワードは8文字以上で入力してください。
              </p>

              {errorMessage && (
                <p
                  role='alert'
                  className='rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700'
                >
                  {errorMessage}
                </p>
              )}

              <button
                type='submit'
                disabled={isSubmitting}
                className='min-h-12 w-full rounded-lg bg-violet-600 px-4 py-3 font-bold text-white hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isSubmitting ? 'Creating account…' : 'Sign up'}
              </button>
            </form>

            <div className='my-9 flex items-center gap-4'>
              <div aria-hidden='true' className='h-px flex-1 bg-slate-300' />
              <span className='text-sm text-slate-500'>or continue with</span>
              <div aria-hidden='true' className='h-px flex-1 bg-slate-300' />
            </div>

            <div className='space-y-4'>
              {[
                { name: 'Apple', image: '/images/auth/apple.png' },
                { name: 'Google', image: '/images/auth/google.jpeg' },
              ].map((provider) => (
                <button
                  key={provider.name}
                  type='button'
                  disabled
                  className='grid min-h-14 w-full cursor-not-allowed grid-cols-[28px_1fr_auto] items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700'
                >
                  <Image
                    src={provider.image}
                    alt=''
                    width={28}
                    height={28}
                    className='h-7 w-7 object-contain'
                  />
                  <span className='text-sm sm:text-base'>
                    Continue with {provider.name}
                  </span>
                  <span className='rounded-full bg-slate-100 px-2 py-1 text-xs'>
                    準備中
                  </span>
                </button>
              ))}
            </div>

            <p className='mt-8 text-center text-sm text-slate-600'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='font-bold text-violet-700 hover:underline'
              >
                Log in
              </Link>
            </p>
          </>
        )}
      </section>
    </SidebarLayout>
  );
}