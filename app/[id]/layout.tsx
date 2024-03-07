export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    id: string;
  };
}) {
  let appName = "Swap";
  let titleSuffix = " - Powered by DODO protocol";
  if (params.id && /^[a-zA-Z0-9_]*$/.test(params.id)) {
    appName = params.id;
  }
  const title = appName + titleSuffix;
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
