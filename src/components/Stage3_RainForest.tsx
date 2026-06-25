import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, CloudRain, Check, AlertCircle, RefreshCw } from 'lucide-react';
import CharacterBubble from './CharacterBubble';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface Stage3Props {
  onComplete: (gems: number) => void;
  onBack: () => void;
}

export default function Stage3_RainForest({ onComplete, onBack }: Stage3Props) {
  const [waterLevel, setWaterLevel] = React.useState(0);
  const [gameState, setGameState] = React.useState<'raining' | 'complete'>('raining');

  // 비 내리기 인터랙션
  const handleWaterTap = () => {
    if (waterLevel < 100) {
      sound.playRainDrop(); // 가벼운 물방울 사운드 효과음
      setWaterLevel(prev => Math.min(prev + 20, 100));
      
      // 100% 도달 시 폭죽 피날레
      if (waterLevel + 20 === 100) {
        sound.playSuccess(); // 미션 성공 축하 사운드!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          setGameState('complete');
        }, 3000);
      }
    }
  };

  const handleReset = () => {
    sound.playTap();
    setWaterLevel(0);
    setGameState('raining');
  };

  const handleNext = () => {
    sound.playTap();
    onComplete(20); // 보석 20개 증정 및 완료
  };

  // 현재 진행 상태에 따른 마스코트 멘트
  const getPuriMessage = () => {
    if (waterLevel === 0) {
      return "바이오매트 섬유층 속에 '수용성 생분해 씨앗 캡슐'들이 내장되어 있어요. 아래의 비 내리기 버튼을 연타하여 대지를 촉촉히 적셔 캡슐을 깨워주세요!";
    }
    if (waterLevel < 60) {
      return "와! 빗물이 닿자 캡슐이 샤르르 녹아 발아하기 시작했어요! 식물의 '자동 발아 트리거'가 작동 중이에요. 비를 더 내려볼까요?";
    }
    if (waterLevel < 100) {
      return "엄청나요! 식물 싹들이 쑥쑥 자라나며 뿌리를 땅속 깊숙이 뻗어가고 있어요! 뿌리가 사면을 꽉 붙잡아 붕괴를 막는답니다!";
    }
    return "경축! 자생 생태계가 완벽히 살아났습니다! 인위적인 관리 없이 스스로 피고 자라나 영구적인 방재 숲을 완성했어요! 💚";
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 text-slate-800 p-5 select-none relative overflow-hidden">
      
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border-2 border-slate-200">
        <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer">
          <ArrowLeft size={20} className="text-slate-500" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-green-600 block tracking-wider">UNIT 3</span>
          <span className="font-extrabold text-xs text-slate-800">빗물과 생명의 발아</span>
        </div>
      </div>

      {/* 중앙 메인 애니메이션 보드 */}
      <div className="flex-1 flex flex-col justify-center my-4 gap-4">
        <CharacterBubble
          message={getPuriMessage()}
          expression={
            waterLevel === 100 
              ? 'excited' 
              : waterLevel >= 60 
              ? 'happy' 
              : waterLevel > 0 
              ? 'happy' 
              : 'normal'
          }
        />

        {/* 식물 성장 인터랙티브 캔버스 */}
        <div className="relative h-64 bg-gradient-to-b from-sky-300 via-sky-400 to-amber-100 rounded-3xl overflow-hidden shadow-2xl border-3 border-slate-200">
          
          {/* 구름 비주얼 (waterLevel > 0일 때 구름이 어두워지고 움직임) */}
          <motion.div 
            animate={{ 
              x: [-10, 10, -10],
              filter: waterLevel > 0 ? 'brightness(0.7)' : 'brightness(1)'
            }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute top-2 left-8 text-slate-100 opacity-90 pointer-events-none"
          >
            <svg width="100" height="40" viewBox="0 0 100 40" fill="currentColor">
              <path d="M 20 30 A 10 10 0 0 1 30 15 A 15 15 0 0 1 65 10 A 12 12 0 0 1 85 20 A 10 10 0 0 1 80 35 Z" />
            </svg>
          </motion.div>

          {/* 빗방울 이펙트 */}
          <AnimatePresence>
            {waterLevel > 0 && waterLevel < 100 && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 260, opacity: [0, 0.7, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + Math.random() * 0.4,
                      delay: Math.random() * 0.5,
                      ease: 'linear'
                    }}
                    className="absolute w-0.5 h-6 bg-sky-200/80 rounded-full"
                    style={{ left: `${5 + (i * 7)}%` }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* 경사진 사면 및 흙 */}
          <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* 지하 흙 속 깊은 레이어 */}
            <path d="M 0 100 L 0 65 L 100 30 L 100 100 Z" fill="#451a03" /> {/* 어두운 지하 흙 */}
            <path d="M 0 65 L 0 55 L 100 25 L 100 30 Z" fill="#78350f" opacity="0.9" /> {/* 표토층 */}
            
            {/* 바이오매트 피복 (빗물 게이지에 따라 투명해지며 땅에 흡수됨) */}
            <path 
              d="M 0 55 L 100 25" 
              stroke="#b45309" 
              strokeWidth="5" 
              strokeDasharray="4 2" 
              opacity={Math.max(0.1, 1 - waterLevel / 110)} 
            />
          </svg>

          {/* 캡슐 및 새싹 렌더링 */}
          <div className="absolute inset-0 pointer-events-none">
            {/* 캡슐 1 (왼쪽) */}
            {waterLevel < 40 && (
              <motion.div
                exit={{ scale: 0, opacity: 0 }}
                className="absolute left-1/4 bottom-[40%] w-3 h-1.5 bg-yellow-400 rounded-full border border-yellow-600 rotate-12"
              />
            )}
            {/* 새싹 1 */}
            {waterLevel >= 40 && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: waterLevel >= 80 ? 1.5 : 1 }}
                className="absolute left-[24%] bottom-[40%] origin-bottom"
              >
                {/* 싹 줄기 */}
                <svg width="20" height="30" viewBox="0 0 20 30">
                  <path d="M 10 30 Q 8 15 12 0" stroke="#22c55e" strokeWidth="2.5" fill="none" />
                  <path d="M 12 5 Q 18 2 15 10" fill="#4ade80" />
                  {waterLevel >= 80 && (
                    <path d="M 8 15 Q 2 12 5 20" fill="#22c55e" />
                  )}
                </svg>
                {/* 흙 속의 뿌리 발달 시각화 */}
                {waterLevel >= 60 && (
                  <motion.svg 
                    initial={{ height: 0 }}
                    animate={{ height: waterLevel >= 80 ? 35 : 15 }}
                    width="12" className="absolute top-[28px] left-[5px] overflow-visible"
                  >
                    <path d="M 5 0 C 3 10 1 20 4 35 M 5 10 C 1 15 -2 20 -1 25" stroke="#f59e0b" strokeWidth="1.2" fill="none" opacity="0.8" />
                  </motion.svg>
                )}
              </motion.g>
            )}

            {/* 캡슐 2 (중앙) */}
            {waterLevel < 30 && (
              <motion.div
                exit={{ scale: 0, opacity: 0 }}
                className="absolute left-1/2 bottom-[50%] w-3 h-1.5 bg-yellow-400 rounded-full border border-yellow-600 -rotate-12"
              />
            )}
            {/* 새싹 2 */}
            {waterLevel >= 30 && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: waterLevel >= 80 ? 1.8 : 1 }}
                className="absolute left-[49%] bottom-[50%] origin-bottom"
              >
                <svg width="20" height="30" viewBox="0 0 20 30">
                  <path d="M 10 30 Q 12 12 7 0" stroke="#22c55e" strokeWidth="2.5" fill="none" />
                  <path d="M 7 2 Q 1 1 3 9" fill="#4ade80" />
                  {waterLevel >= 80 && (
                    <path d="M 9 12 Q 16 10 14 18" fill="#16a34a" />
                  )}
                </svg>
                {/* 뿌리 */}
                {waterLevel >= 60 && (
                  <motion.svg 
                    initial={{ height: 0 }}
                    animate={{ height: waterLevel >= 80 ? 40 : 18 }}
                    width="12" className="absolute top-[28px] left-[5px] overflow-visible"
                  >
                    <path d="M 5 0 C 7 15 9 25 5 40 M 5 15 C 9 20 12 25 10 30" stroke="#f59e0b" strokeWidth="1.2" fill="none" opacity="0.8" />
                  </motion.svg>
                )}
              </motion.g>
            )}

            {/* 캡슐 3 (오른쪽) */}
            {waterLevel < 50 && (
              <motion.div
                exit={{ scale: 0, opacity: 0 }}
                className="absolute left-3/4 bottom-[60%] w-3 h-1.5 bg-yellow-400 rounded-full border border-yellow-600 rotate-45"
              />
            )}
            {/* 새싹 3 */}
            {waterLevel >= 50 && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: waterLevel >= 80 ? 1.6 : 1 }}
                className="absolute left-[74%] bottom-[60%] origin-bottom"
              >
                <svg width="20" height="30" viewBox="0 0 20 30">
                  <path d="M 10 30 Q 9 16 11 0" stroke="#22c55e" strokeWidth="2.5" fill="none" />
                  <path d="M 11 4 Q 17 0 14 8" fill="#4ade80" />
                  {waterLevel >= 80 && (
                    <path d="M 9 14 Q 3 10 6 18" fill="#22c55e" />
                  )}
                </svg>
                {/* 뿌리 */}
                {waterLevel >= 60 && (
                  <motion.svg 
                    initial={{ height: 0 }}
                    animate={{ height: waterLevel >= 80 ? 38 : 16 }}
                    width="12" className="absolute top-[28px] left-[5px] overflow-visible"
                  >
                    <path d="M 5 0 C 4 12 3 22 6 38 M 5 12 C 1 18 -1 22 1 28" stroke="#f59e0b" strokeWidth="1.2" fill="none" opacity="0.8" />
                  </motion.svg>
                )}
              </motion.g>
            )}

            {/* 꽃봉오리와 나비 (완전 성장 시) */}
            {waterLevel === 100 && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute left-[54%] bottom-[58%] text-red-500 text-sm animate-bounce"
                >
                  🌸
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute left-[28%] bottom-[48%] text-yellow-500 text-xs animate-bounce delay-100"
                >
                  🌼
                </motion.div>
                {/* 나비 비행 애니메이션 */}
                <motion.div
                  animate={{ 
                    x: [0, 80, -30, 0],
                    y: [0, -30, 20, 0],
                    rotate: [0, 15, -15, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  className="absolute left-1/3 top-12 text-sm"
                >
                  🦋
                </motion.div>
              </>
            )}
          </div>

          {/* 수분 & 생태 복원도 안내 게이지 */}
          <div className="absolute top-2 left-2 bg-slate-950/80 px-2.5 py-1 rounded-lg text-[10px] font-black text-white border border-slate-700 flex items-center gap-1">
            <span>토양 수분도: {waterLevel}%</span>
          </div>

          {waterLevel === 100 && (
            <div className="absolute inset-0 bg-green-950/20 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-600 text-white font-bold text-xs px-4 py-2 rounded-full border-2 border-green-300 flex items-center gap-1 shadow-lg"
              >
                🎉 사면 안정화 & 생태 복원 성공!
              </motion.div>
            </div>
          )}
        </div>

        {/* 인터랙션 버튼 */}
        {gameState === 'raining' && (
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleWaterTap}
              disabled={waterLevel >= 100}
              className={`flex-1 py-4 rounded-2xl font-black text-sm border-b-4 flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer ${
                waterLevel >= 100
                  ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                  : 'bg-sky-500 border-sky-700 hover:bg-sky-400 text-white'
              }`}
            >
              <CloudRain size={18} />
              {waterLevel >= 100 ? '대지가 촉촉해졌습니다!' : '하늘에서 비 내리게 하기 (클릭!)'}
            </motion.button>

            {waterLevel > 0 && (
              <button
                onClick={handleReset}
                className="p-3 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-500 rounded-2xl cursor-pointer"
                title="다시 하기"
              >
                <RefreshCw size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 하단 제어 버튼 */}
      <div className="pb-4">
        <button
          onClick={handleNext}
          disabled={gameState !== 'complete'}
          className={`w-full py-4 rounded-2xl font-black text-sm border-b-4 flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer ${
            gameState !== 'complete'
              ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
              : 'bg-yellow-400 border-yellow-600 hover:bg-yellow-300 text-green-950'
          }`}
        >
          <Sparkles size={16} className="fill-current" />
          보석 20개 받고 마지막 유닛 이동!
        </button>
      </div>
    </div>
  );
}
