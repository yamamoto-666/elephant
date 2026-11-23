//APIの接続先URLを組み立てる
export function apiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URLが設定されていません。');
  }

  const base = baseUrl.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');

  return `${base}/${cleanPath}`;
}

export async function getCsrfToken(): Promise<string> {
  //laravel にcsrf用のcookieを発行してもらう
  const response = await fetch(apiUrl('/sanctum/csrf-cookie'), {
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(
      `CSRFトークンを取得できませんでした (HTTP${response.status})`,
    );
  }

  //ブラウザに保存されたcookieトークンを探す
  const tokenCookie = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('XSRF-TOKEN='));
  
  if(!tokenCookie) {
    throw new Error ('CSRFトークンのCookieが見つかりません');
  }

  //cookie名を取り除き、URLエンコードされた値を元に戻す
  return decodeURIComponent(tokenCookie.slice('XSRF-TOKEN='.length));
}