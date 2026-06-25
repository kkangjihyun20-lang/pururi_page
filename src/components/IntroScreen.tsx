import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Play, Award, Trees } from 'lucide-react';
import { sound } from '../utils/audio';

interface IntroScreenProps {
  onStart: (name: string) => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      sound.playFailure();
      setError('이름이나 닉네임을 입력해 주세요!');
      return;
    }
    sound.playSuccess();
    onStart(name.trim());
  };

  return (
    <div className="flex-1 bg-green-500 text-white flex flex-col justify-between p-6 relative overflow-hidden select-none">
      {/* 장식용 구름 & 나뭇잎 배경 */}
      <div className="absolute top-10 left-[-20px] opacity-10 pointer-events-none">
        <Trees size={150} />
      </div>
      <div className="absolute bottom-20 right-[-30px] opacity-10 pointer-events-none">
        <Trees size={180} />
      </div>

      {/* 상단 헤더: YIDP 2026 공모전 */}
      <div className="text-center pt-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-600/50 rounded-full text-xs font-bold tracking-wider uppercase mb-3 border border-green-400/30"
        >
          <Award size={14} className="text-yellow-300" />
          BMW Young Innovator Dream Project 2026
        </motion.div>
        
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="text-4xl font-extrabold tracking-tight drop-shadow-md text-white font-sans flex flex-col items-center gap-1"
        >
          <span className="text-green-100 text-lg font-medium">환경 보호 & 생태 복원 프로젝트</span>
          <span className="text-yellow-300 text-5xl font-black">푸르리</span>
        </motion.h1>
      </div>

      {/* 중앙 캐릭터 쇼케이스 */}
      <div className="flex flex-col items-center my-auto z-10 py-4">
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [-2, 2, -2],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'easeInOut',
          }}
          className="relative w-44 h-44 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-sm border-2 border-white/20 shadow-xl"
        >
          <svg width="140" height="140" viewBox="0 0 60 60">
            {/* 그림자 */}
            <ellipse cx="30" cy="54" rx="16" ry="4" fill="#15803d" opacity="0.4" />
            
            {/* 새싹 날개/손 */}
            <motion.path
              d="M 12 35 C 5 32 5 25 12 28 Z"
              fill="#86efac"
              animate={{ rotate: [0, -15, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 48 35 C 55 32 55 25 48 28 Z"
              fill="#86efac"
              animate={{ rotate: [0, 15, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />

            {/* 몸통 */}
            <rect x="14" y="18" width="32" height="34" rx="16" fill="#16a34a" />
            <ellipse cx="30" cy="38" rx="11" ry="11" fill="#4ade80" />

            {/* 머리 위 새싹 */}
            <motion.path
              d="M 28 18 C 24 10 18 10 24 6 C 30 6 30 14 28 18 Z"
              fill="#86efac"
              transform-origin="28px 18px"
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 32 18 C 36 10 42 10 36 6 C 30 6 32 14 32 18 Z"
              fill="#86efac"
              transform-origin="32px 18px"
              animate={{ rotate: [8, -8, 8] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />

            {/* 눈 */}
            <circle cx="23" cy="28" r="3.5" fill="#1e293b" />
            <circle cx="24" cy="26.5" r="1.2" fill="#ffffff" />
            <circle cx="37" cy="28" r="3.5" fill="#1e293b" />
            <circle cx="38" cy="26.5" r="1.2" fill="#ffffff" />

            {/* 볼 */}
            <circle cx="18" cy="33" r="2.5" fill="#fca5a5" opacity="0.9" />
            <circle cx="42" cy="33" r="2.5" fill="#fca5a5" opacity="0.9" />

            {/* 입 */}
            <path d="M 23 34 Q 30 43 37 34 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="1.5" />
          </svg>
          
          <span className="absolute bottom-2 bg-yellow-400 text-green-950 px-3 py-0.5 rounded-full text-xs font-bold shadow-md">
            캡슐 요정 '푸리'
          </span>
        </motion.div>

        {/* 간단 소개 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/25 max-w-[340px] text-xs leading-relaxed text-green-50 shadow-md"
        >
          <p className="font-semibold text-white text-sm mb-1.5 flex items-center justify-center gap-1">
            <Sparkles size={14} className="text-yellow-300 animate-spin" />
            씨앗 캡슐을 품은 100% 생분해 바이오매트
          </p>
          버려지던 농업 폐자원(옥수수대, 볏짚)을 엮어 만든 바이오매트와 빗물에 녹는 씨앗 캡슐이 만나 파괴된 사면의 생태계를 스스로 복원합니다.
          <div className="mt-2 text-[10px] text-green-200 border-t border-white/10 pt-1.5 flex justify-around">
            <span>팀명: <strong className="text-white font-bold">푸르리</strong></span>
            <span>팀원: <strong className="text-white font-bold">강지현, 박정현, 이지우, 이태희</strong></span>
          </div>
        </motion.div>
      </div>

      {/* 하단 입력 폼 및 시작 버튼 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full z-10 pb-8"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="체험할 이름을 입력해 주세요!"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              maxLength={10}
              className="w-full px-5 py-4 bg-white text-slate-800 rounded-2xl border-b-4 border-slate-300 font-bold focus:outline-none focus:border-yellow-400 transition-all text-center text-base placeholder:text-slate-400"
            />
            {error && (
              <p className="text-red-100 text-xs text-center mt-1.5 font-bold bg-red-500/50 py-1 rounded-lg">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-green-950 rounded-2xl font-black text-lg shadow-lg border-b-4 border-yellow-600 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play size={20} className="fill-current" />
            모험 시작하기
          </button>
        </form>
      </motion.div>
    </div>
  );
}
