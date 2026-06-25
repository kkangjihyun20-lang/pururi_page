import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 md:p-6 font-sans antialiased overflow-hidden">
      {/* 폰 형태의 프레임 (데스크탑에서만 보이고 모바일에서는 꽉 참) */}
      <div className="w-full h-screen md:h-[840px] md:w-[410px] md:rounded-[48px] md:border-[12px] md:border-slate-950 bg-white relative shadow-2xl flex flex-col overflow-hidden md:ring-8 md:ring-slate-800">
        
        {/* 데스크탑 폰 노치 상단 바 */}
        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-950 rounded-b-2xl z-50 items-center justify-center">
          <div className="w-3 h-3 bg-slate-900 rounded-full mr-2" /> {/* 카메라 구멍 */}
          <div className="w-12 h-1 bg-slate-800 rounded-full" /> {/* 스피커 그릴 */}
        </div>

        {/* 실제 내부 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto relative bg-slate-50">
          {children}
        </div>

        {/* 홈 인디케이터 (데스크탑 전용 하단 바) */}
        <div className="hidden md:block absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-950 rounded-full z-50" />
      </div>
    </div>
  );
}
