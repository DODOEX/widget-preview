'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <div>{error.message}</div>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
