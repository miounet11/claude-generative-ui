import "./globals.css";

export const metadata = {
  title: "__APP_NAME__",
  description: "A StreamCanvas starter app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
