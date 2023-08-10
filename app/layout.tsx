import { headers } from 'next/headers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerMap = headers();
  const nextUrl = headerMap.get('next-url') ?? headerMap.get('x-invoke-path');
  let title = 'Swap';
  if (nextUrl && /^\/[^\/]+$/.test(nextUrl)) {
    title = nextUrl.replace(/^\//, '');
  }
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
