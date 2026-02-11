import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '층층이 - AI 인테리어 견적 시뮬레이터',
  description: '방 사진 한 장으로 인테리어 자재를 레이어별로 비교하고, 실시간 견적과 AI 시공 가이드를 제공합니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  );
}
