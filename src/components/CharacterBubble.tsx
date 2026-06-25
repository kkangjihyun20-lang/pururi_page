import React from 'react';
import { motion } from 'motion/react';

interface CharacterBubbleProps {
  message: string;
  expression?: 'normal' | 'happy' | 'sad' | 'excited' | 'shocked';
  position?: 'left' | 'right' | 'center';
}

export default function CharacterBubble({
  message,
  expression = 'normal',
  position = 'left',
}: CharacterBubbleProps) {
  // SVG를 이용한 귀여운 캐릭터 '푸리' (씨앗 캡슐 요정)
  const renderCharacter = () => {
    let eyeRotation = 0;
    let eyeScaleY = 1;
    let cheekColor = '#fca5a5'; // red-300
    let mouthPath = 'M 25 35 Q 30 40 35 35'; // smiling

    if (expression === 'happy' || expression === 'excited') {
      eyeScaleY = 0.3;
      mouthPath = 'M 22 33 Q 30 45 38 33 Z'; // big open smile
    } else if (expression === 'sad') {
      mouthPath = 'M 24 38 Q 30 32 36 38'; // frowning
      cheekColor = '#94a3b8'; // gray-400
    } else if (expression === 'shocked') {
      mouthPath = 'M 30 38 A 4 4 0 1 0 30 37.9'; // O mouth
    }

    return (
      <svg width="100" height="100" viewBox="0 0 60 60" className="drop-shadow-md">
        {/* 그림자 */}
        <ellipse cx="30" cy="54" rx="16" ry="4" fill="#cbd5e1" />

        {/* 새싹 날개/손 */}
        <motion.path
          d="M 12 35 C 5 32 5 25 12 28 Z"
          fill="#4ade80"
          animate={expression === 'excited' ? { rotate: [0, -20, 10, 0] } : { rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 48 35 C 55 32 55 25 48 28 Z"
          fill="#4ade80"
          animate={expression === 'excited' ? { rotate: [0, 20, -10, 0] } : { rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />

        {/* 몸통 (씨앗 캡슐 모양 - 둥근 타원형) */}
        <rect x="14" y="18" width="32" height="34" rx="16" fill="#22c55e" />
        {/* 배 (밝은 연두색) */}
        <ellipse cx="30" cy="38" rx="11" ry="11" fill="#86efac" />

        {/* 머리 위 새싹 잎사귀 1 (왼쪽) */}
        <motion.path
          d="M 28 18 C 24 10 18 10 24 6 C 30 6 30 14 28 18 Z"
          fill="#4ade80"
          transform-origin="28px 18px"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
        {/* 머리 위 새싹 잎사귀 2 (오른쪽) */}
        <motion.path
          d="M 32 18 C 36 10 42 10 36 6 C 30 6 32 14 32 18 Z"
          fill="#4ade80"
          transform-origin="32px 18px"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        />

        {/* 귀여운 노란 씨앗 모자 테두리 (캡슐 질감) */}
        <path d="M 14 26 Q 30 22 46 26 C 46 18 14 18 14 26" fill="#f59e0b" opacity="0.3" />

        {/* 왼쪽 눈 */}
        <motion.g
          animate={expression === 'excited' ? { y: [-1, 1, -1] } : {}}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          <ellipse cx="23" cy="28" rx="3.5" ry={3.5 * eyeScaleY} fill="#1e293b" />
          {expression !== 'sad' && expression !== 'happy' && (
            <circle cx="24" cy="26.5" r="1.2" fill="#ffffff" />
          )}
        </motion.g>

        {/* 오른쪽 눈 */}
        <motion.g
          animate={expression === 'excited' ? { y: [1, -1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          <ellipse cx="37" cy="28" rx="3.5" ry={3.5 * eyeScaleY} fill="#1e293b" />
          {expression !== 'sad' && expression !== 'happy' && (
            <circle cx="38" cy="26.5" r="1.2" fill="#ffffff" />
          )}
        </motion.g>

        {/* 볼 터치 */}
        <circle cx="18" cy="33" r="2.5" fill={cheekColor} opacity="0.8" />
        <circle cx="42" cy="33" r="2.5" fill={cheekColor} opacity="0.8" />

        {/* 입 */}
        <path d={mouthPath} stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill={expression === 'happy' || expression === 'excited' ? '#ef4444' : 'none'} />
      </svg>
    );
  };

  const bubbleVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <div
      className={`flex items-center gap-3 w-full ${
        position === 'right'
          ? 'flex-row-reverse'
          : position === 'center'
          ? 'flex-col items-center'
          : 'flex-row'
      }`}
    >
      <motion.div
        className="flex-shrink-0"
        animate={{
          y: expression === 'excited' ? [-4, 4, -4] : [-2, 2, -2],
        }}
        transition={{
          repeat: Infinity,
          duration: expression === 'excited' ? 0.6 : 1.5,
          ease: 'easeInOut',
        }}
      >
        {renderCharacter()}
      </motion.div>

      <motion.div
        variants={bubbleVariants}
        initial="hidden"
        animate="visible"
        className={`relative max-w-[75%] p-4 rounded-2xl border-3 text-sm font-sans leading-relaxed shadow-sm ${
          expression === 'sad'
            ? 'bg-slate-100 border-slate-300 text-slate-700'
            : expression === 'excited'
            ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold animate-pulse'
            : 'bg-white border-green-500 text-slate-800'
        }`}
      >
        {/* 말풍선 꼬리 */}
        <div
          className={`absolute w-3 h-3 rotate-45 border-r-3 border-b-3 ${
            expression === 'sad'
              ? 'bg-slate-100 border-slate-300'
              : expression === 'excited'
              ? 'bg-amber-50 border-amber-300'
              : 'bg-white border-green-500'
          } ${
            position === 'right'
              ? '-left-1.5 top-8 border-t-0 border-r-0 rotate-[135deg]'
              : position === 'center'
              ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1.5 border-t-0 border-l-0 rotate-45'
              : '-left-1.5 top-8 border-t-0 border-l-0 rotate-135'
          }`}
          style={{
            transform:
              position === 'right'
                ? 'rotate(135deg)'
                : position === 'center'
                ? 'rotate(45deg)'
                : 'rotate(-135deg)',
          }}
        />
        {message}
      </motion.div>
    </div>
  );
}
