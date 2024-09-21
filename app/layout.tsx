import 'bootstrap/dist/css/bootstrap.css';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-bs-theme="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
