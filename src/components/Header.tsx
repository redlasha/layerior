'use client';

import { useRef } from 'react';
import { useStore } from '@/store/useStore';
import { mockAnalyze } from '@/lib/mockApi';

export default function Header() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { image, setImage, setAnalysisResult } = useStore();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setImage(base64);
      try {
        const result = await mockAnalyze(base64);
        setAnalysisResult(result);
      } catch {
        // mock never fails, but handle gracefully
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <header className="sticky top-0 z-[100] bg-surface border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">층층이</span>
          <span className="text-xs text-text-muted hidden sm:inline">AI 인테리어 견적 시뮬레이터</span>
        </div>
        <div className="flex items-center gap-3">
          {image && (
            <button
              onClick={() => { setImage(null); setAnalysisResult(null); }}
              className="text-sm text-text-secondary hover:text-danger transition-colors"
            >
              사진 제거
            </button>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-[10px] hover:opacity-90 transition-opacity"
          >
            {image ? '사진 변경' : '사진 업로드'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>
    </header>
  );
}
