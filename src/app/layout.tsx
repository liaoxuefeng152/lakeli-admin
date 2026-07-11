import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '拉克力后台管理系统',
  description: '拉克力统一中台 - 一体化后台管理系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
