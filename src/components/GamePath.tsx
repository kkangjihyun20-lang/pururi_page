import React from 'react';
import { motion } from 'motion/react';
import { Heart, Flame, Award, Check, Lock, Star, Sparkles, ChevronRight, MessageSquare } from 'lucide-react';
import { GameState } from '../types';
import CharacterBubble from './CharacterBubble';
import { sound } from '../utils/audio';

interface GamePathProps {
  gameState: GameState;
  onSelectStage: (stage: 'stage1' | 'stage2' | 'stage3' | 'stage4') => void;
  onReset: () => void;
}

export default function GamePath({ gameState, onSelectStage, onReset }: GamePathProps) {
  const [showResetModal, setShowResetModal] = React.useState(false);

  const getStageStatus = (stageId: 'stage1' | 'stage2' | 'stage3' | 'stage4') => {
    if (gameState.completedStages[stageId]) return 'completed';
    
    // 이전 스테이지 완료 여부에 따른 해금 조건
    if (stageId === 'stage1') return 'active';
    if (stageId === 'stage2' && gameState.completedStages.stage1) return 'active';
    if (stageId === 'stage3' && gameState.completedStages.stage2) return 'active';
    if (stageId === 'stage4' && gameState.completedStages.stage3) return 'active';
    
    return 'locked';
  };

  const getStageTitle = (stageId: string) => {
    switch (stageId) {
      case 'stage1': return '위기의 민둥산';
      case 'stage2': return '친환경 푸른 방패';
      case 'stage3': return '빗물과 생명의 씨앗';
      case 'stage4': return '기적의 숲 & 투표하기';
      default: return '';
    }
  };

  const getStageDesc = (stageId: string) => {
    switch (stageId) {
      case 'stage1': return '기존 플라스틱 매트 소각의 탄소 배출 문제점 확인하기';
      case 'stage2': return '농업 폐자원을 엮어 100% 생분해 바이오매트 만들기';
      case 'stage3': return '비를 내려 수용성 씨앗 캡슐을 녹이고 식물 키우기';
      case 'stage4': return '푸르리 응원 투표를 완료하고 나만의 환경 지킴이 수료증 받기';
      default: return '';
    }
  };

  // 듀오링고 가이드 멘트 (진행 상황에 따라 유연하게 바뀜)
  const getGuideMessage = () => {
    if (gameState.completedStages.stage4) {
      return `우와! ${gameState.userName}님, 푸르리와 함께 파괴된 숲을 완벽하게 되살렸어요! 숲 지킴이 수료증이 발급되었으니 확인해 보세요! 💚`;
    }
    if (gameState.completedStages.stage3) {
      return `비가 내려 캡슐이 스스로 녹아 울창한 숲이 되었어요! 이제 마지막 유닛에서 푸르리 팀을 응원하고 서약해 봐요! 🎁`;
    }
    if (gameState.completedStages.stage2) {
      return `완벽해요! 농업 잔재물로 멋진 푸른 방패를 만들었네요! 이제 3단계 유닛을 터치해 비를 내리고 씨앗을 발아시켜봐요! 🌧️`;
    }
    if (gameState.completedStages.stage1) {
      return `플라스틱 매트가 타는 가스 탄소 장막을 경험하셨군요! 2단계 유닛을 눌러 버려지던 옥수수대와 볏짚으로 천연 바이오매트를 짜보세요! ✨`;
    }
    return `안녕! ${gameState.userName}님, 나는 '푸리'야! 위기에 빠진 민둥산을 살리는 1단계 유닛을 눌러 모험을 시작해 봐요!`;
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 relative pb-16 select-none">
      
      {/* 1. 상단 듀오링고 스타일의 게이지 바 */}
      <div className="bg-white border-b-2 border-slate-200 px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-1">
          <TreesIcon className="w-6 h-6 text-green-500" />
          <span className="font-extrabold text-slate-800 text-sm tracking-tight">푸르리 복원</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 연속 학습 스트릭 */}
          <div className="flex items-center gap-1 text-orange-500 font-extrabold text-sm">
            <Flame size={18} className="fill-current animate-pulse" />
            <span>{gameState.streak}일</span>
          </div>

          {/* 보석 */}
          <div className="flex items-center gap-1 text-cyan-500 font-extrabold text-sm">
            <Star size={18} className="fill-current" />
            <span>{gameState.gems}</span>
          </div>

          {/* 하트 */}
          <div className="flex items-center gap-1 text-rose-500 font-extrabold text-sm">
            <Heart size={18} className="fill-current animate-bounce" />
            <span>{gameState.hearts}</span>
          </div>
        </div>
      </div>

      {/* 2. 유닛 헤더 배너 */}
      <div className="m-4 p-4 bg-green-500 text-white rounded-2xl border-b-4 border-green-700 shadow-sm relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-10px] opacity-20 transform rotate-12">
          <Star size={100} />
        </div>
        <span className="text-[10px] font-black tracking-widest bg-green-600/50 px-2 py-0.5 rounded-full uppercase">
          YIDP 2026 공모전 부스
        </span>
        <h2 className="text-xl font-extrabold mt-1 tracking-tight">지구를 살리는 바이오매트</h2>
        <p className="text-xs text-green-100 mt-1 leading-relaxed">
          버려진 옥수수대와 볏짚으로 흙이 무너지는 사면을 단단히 지키고 생태계를 되살리는 게임식 미션!
        </p>
      </div>

      {/* 3. 귀여운 가이드 캐릭터 말풍선 */}
      <div className="px-4 py-2 mt-1">
        <CharacterBubble
          message={getGuideMessage()}
          expression={
            gameState.completedStages.stage4
              ? 'excited'
              : gameState.completedStages.stage3
              ? 'happy'
              : gameState.completedStages.stage1
              ? 'happy'
              : 'normal'
          }
        />
      </div>

      {/* 4. 구불구불한 듀오링고 맵 경로 */}
      <div className="flex-1 py-12 px-6 flex flex-col items-center justify-center gap-10 relative">
        
        {/* 점선 곡선 경로 배경 */}
        <div className="absolute top-16 bottom-16 left-1/2 -translate-x-1/2 w-1 border-l-4 border-dashed border-green-300 pointer-events-none" />

        {/* 스테이지 1: 위기의 민둥산 */}
        <div className="relative w-full flex justify-center translate-x-[-30px]">
          <StageButton
            stageId="stage1"
            index={1}
            status={getStageStatus('stage1')}
            title={getStageTitle('stage1')}
            desc={getStageDesc('stage1')}
            onClick={() => onSelectStage('stage1')}
          />
        </div>

        {/* 스테이지 2: 친환경 푸른 방패 */}
        <div className="relative w-full flex justify-center translate-x-[30px]">
          <StageButton
            stageId="stage2"
            index={2}
            status={getStageStatus('stage2')}
            title={getStageTitle('stage2')}
            desc={getStageDesc('stage2')}
            onClick={() => onSelectStage('stage2')}
          />
        </div>

        {/* 스테이지 3: 빗물과 생명의 씨앗 */}
        <div className="relative w-full flex justify-center translate-x-[-20px]">
          <StageButton
            stageId="stage3"
            index={3}
            status={getStageStatus('stage3')}
            title={getStageTitle('stage3')}
            desc={getStageDesc('stage3')}
            onClick={() => onSelectStage('stage3')}
          />
        </div>

        {/* 스테이지 4: 투표하기 */}
        <div className="relative w-full flex justify-center translate-x-[20px]">
          <StageButton
            stageId="stage4"
            index={4}
            status={getStageStatus('stage4')}
            title={getStageTitle('stage4')}
            desc={getStageDesc('stage4')}
            onClick={() => onSelectStage('stage4')}
          />
        </div>
      </div>

      {/* 하단 푸터 / 초기화 버튼 */}
      <div className="px-4 py-3 flex justify-between items-center bg-white border-t border-slate-200 text-xs text-slate-400">
        <span>BMW 영 이노베이터 드림 프로젝트 © 푸르리</span>
        <button
          onClick={() => {
            sound.playTap();
            setShowResetModal(true);
          }}
          className="text-green-500 font-bold hover:underline cursor-pointer"
        >
          진행도 초기화
        </button>
      </div>

      {/* 커스텀 진행도 초기화 컨펌 모달 */}
      {showResetModal && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-5 animate-fade-in">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl border-b-4 border-slate-200 p-6 max-w-[280px] w-full text-center shadow-2xl relative overflow-hidden"
          >
            {/* 귀여운 경고 아이콘 */}
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Flame className="w-6 h-6 text-red-500" />
            </div>
            
            <h3 className="text-base font-black text-slate-800 leading-tight">
              진행 상황을<br />정말 초기화할까요?
            </h3>
            
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-semibold">
              지금까지 모은 모든 보석({gameState.gems}개)과 유닛 미션 진행 기록이 모두 사라지며 처음부터 다시 복원 모험을 시작하게 됩니다.
            </p>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => {
                  sound.playTap();
                  setShowResetModal(false);
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-black text-xs cursor-pointer border-b-2 border-slate-300"
              >
                취소하기
              </button>
              <button
                onClick={() => {
                  sound.playFailure();
                  setShowResetModal(false);
                  onReset();
                }}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded-xl font-black text-xs cursor-pointer border-b-2 border-red-700"
              >
                네, 초기화할래요
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// 숲 이모지 컴포넌트
function TreesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22v-5" />
      <path d="M17 17a5 5 0 0 0-10 0" />
      <path d="m12 12-4-4" />
      <path d="m12 12 4-4" />
      <path d="M12 2v10" />
      <path d="M8 8a4 4 0 0 1 8 0" />
    </svg>
  );
}

interface StageButtonProps {
  stageId: 'stage1' | 'stage2' | 'stage3' | 'stage4';
  index: number;
  status: 'completed' | 'active' | 'locked';
  title: string;
  desc: string;
  onClick: () => void;
}

function StageButton({ stageId, index, status, title, desc, onClick }: StageButtonProps) {
  const getIcon = () => {
    if (status === 'completed') {
      return <Check size={26} className="text-white font-bold" />;
    }
    if (status === 'locked') {
      return <Lock size={22} className="text-slate-400" />;
    }
    return <Star size={26} className="text-green-950 fill-yellow-300 animate-pulse" />;
  };

  const getBgClass = () => {
    if (status === 'completed') return 'bg-green-500 border-green-700 hover:bg-green-400';
    if (status === 'locked') return 'bg-slate-200 border-slate-400 cursor-not-allowed';
    return 'bg-yellow-400 border-yellow-600 hover:bg-yellow-300 animate-bounce shadow-yellow-200';
  };

  const handleClick = () => {
    if (status !== 'locked') {
      sound.playTap();
      onClick();
    } else {
      sound.playFailure();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 group max-w-[200px]">
      <motion.button
        whileTap={status !== 'locked' ? { scale: 0.9 } : {}}
        onClick={handleClick}
        className={`w-16 h-16 rounded-full border-b-4 flex items-center justify-center shadow-lg transition-all z-10 cursor-pointer ${getBgClass()}`}
        disabled={status === 'locked'}
      >
        {getIcon()}
      </motion.button>

      {/* 말풍선 호버 팝업 및 타이틀 */}
      <div className="text-center">
        <span className="block text-[11px] font-black text-slate-400 tracking-wider uppercase">
          UNIT {index}
        </span>
        <span className={`block text-xs font-black leading-tight ${status === 'locked' ? 'text-slate-400' : 'text-slate-800'}`}>
          {title}
        </span>
        <span className="block text-[9px] text-slate-400 leading-tight mt-0.5 max-w-[140px] mx-auto">
          {desc}
        </span>
      </div>
    </div>
  );
}
