import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, Check, ChevronRight } from 'lucide-react';
import CharacterBubble from './CharacterBubble';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface Stage2Props {
  onComplete: (gems: number) => void;
  onBack: () => void;
}

export default function Stage2_BioMat({ onComplete, onBack }: Stage2Props) {
  const [step, setStep] = React.useState<'weaving' | 'pinning' | 'complete'>('weaving');
  
  // 방재 자원 수집율 상태
  const [materials, setMaterials] = React.useState({
    cornStalk: { count: 0, max: 3, label: '옥수수대 (수분 보유)', color: 'bg-yellow-400 text-yellow-950 border-yellow-600' },
    riceStraw: { count: 0, max: 3, label: '볏짚 (충격 흡수)', color: 'bg-amber-400 text-amber-950 border-amber-600' },
    juteThred: { count: 0, max: 3, label: '황마실 (인장 강도)', color: 'bg-orange-300 text-orange-950 border-orange-500' },
  });

  // 대나무 핀 고정 클릭 카운트
  const [pinCount, setPinCount] = React.useState(0);
  const maxPins = 5;

  // 전체 짜임 게이지 계산 (최대 9)
  const totalCollected = materials.cornStalk.count + materials.riceStraw.count + materials.juteThred.count;
  const weavePercentage = Math.round((totalCollected / 9) * 100);

  const handleCollect = (key: 'cornStalk' | 'riceStraw' | 'juteThred') => {
    if (materials[key].count < materials[key].max) {
      sound.playPop(); // 귀여운 재료 수집 팝 효과음
      setMaterials(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          count: prev[key].count + 1
        }
      }));
    }
  };

  const handlePinTap = () => {
    if (pinCount < maxPins) {
      sound.playTap(); // 핀 박는 틱 소리
      setPinCount(prev => prev + 1);
      if (pinCount + 1 === maxPins) {
        sound.playSuccess(); // 고정 완료 성공음!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.8 }
        });
        setStep('complete');
      }
    }
  };

  const handleNextStep = () => {
    sound.playTap();
    if (step === 'weaving' && weavePercentage === 100) {
      sound.playSuccess(); // 단계 완료 상승음!
      setStep('pinning');
    } else if (step === 'complete') {
      onComplete(15); // 보석 15개 획득하고 완료
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 text-slate-800 p-5 select-none relative overflow-hidden">
      
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border-2 border-slate-200">
        <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer">
          <ArrowLeft size={20} className="text-slate-500" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-green-600 block tracking-wider">UNIT 2</span>
          <span className="font-extrabold text-xs text-slate-800">친환경 바이오매트 짜기</span>
        </div>
      </div>

      {/* 중앙 미션 게임 보드 */}
      <div className="flex-1 flex flex-col justify-center my-4 gap-4">
        {step === 'weaving' && (
          <div className="flex flex-col gap-4">
            <CharacterBubble
              message="농가에서 처치 곤란해 버려두거나 태우던 농업 부산물(옥수수대, 볏짚, 황마)을 엮어 100% 생분해 바이오매트를 짜봅시다! 재료를 각각 3번씩 탭해서 매트를 가득 채워보세요!"
              expression={weavePercentage === 100 ? 'happy' : 'normal'}
            />

            {/* 바이오매트 직조 그래픽 시각화 */}
            <div className="h-44 bg-amber-50 rounded-3xl border-3 border-amber-200 overflow-hidden relative flex flex-col items-center justify-center p-3 shadow-inner">
              {/* 직조 격자 모양 시뮬레이션 */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-30 pointer-events-none">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-amber-800/20" />
                ))}
              </div>

              {/* 실제 실시간 쌓이는 매트 레이어 */}
              <div className="w-full h-full relative flex items-center justify-center">
                {/* 옥수수대 더미 */}
                {materials.cornStalk.count > 0 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-x-4 inset-y-6 bg-yellow-400/20 border-2 border-yellow-500/40 rounded-xl flex flex-wrap gap-2 p-2 overflow-hidden"
                  >
                    {Array.from({ length: materials.cornStalk.count }).map((_, i) => (
                      <div key={i} className="h-4 w-20 bg-yellow-400 border border-yellow-600 rounded-full opacity-80" />
                    ))}
                  </motion.div>
                )}

                {/* 볏짚 더미 */}
                {materials.riceStraw.count > 0 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-x-8 inset-y-10 bg-amber-300/30 border-2 border-amber-500/30 rounded-lg flex flex-wrap gap-1 p-2 overflow-hidden rotate-2"
                  >
                    {Array.from({ length: materials.riceStraw.count }).map((_, i) => (
                      <div key={i} className="h-2 w-24 bg-amber-300 border border-amber-500 rounded opacity-85 rotate-[-5deg]" />
                    ))}
                  </motion.div>
                )}

                {/* 황마실 더미 (격자형 끈 형태) */}
                {materials.juteThred.count > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    className="absolute inset-2 flex flex-col justify-around pointer-events-none"
                  >
                    {Array.from({ length: materials.juteThred.count }).map((_, i) => (
                      <div key={i} className="w-full h-1.5 bg-orange-400/80 rounded-full shadow-sm" />
                    ))}
                  </motion.div>
                )}

                {/* 진행률 텍스트 피드백 */}
                <div className="absolute bg-white/95 px-4 py-1.5 rounded-full border-2 border-green-500 text-center font-extrabold text-xs text-green-700 shadow-md">
                  바이오매트 직조율: {weavePercentage}%
                </div>
              </div>
            </div>

            {/* 재료 선택 탭 인터랙션 */}
            <div className="grid grid-cols-3 gap-2">
              {(['cornStalk', 'riceStraw', 'juteThred'] as const).map((key) => {
                const mat = materials[key];
                const isMax = mat.count === mat.max;

                return (
                  <button
                    key={key}
                    onClick={() => handleCollect(key)}
                    disabled={isMax}
                    className={`p-3 rounded-xl border-b-4 flex flex-col items-center justify-between gap-1.5 transition-all text-[11px] font-black cursor-pointer ${
                      isMax 
                        ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed' 
                        : mat.color
                    }`}
                  >
                    <span className="text-center leading-tight">{mat.label}</span>
                    <span className="bg-white/80 px-2 py-0.5 rounded-full text-[10px]">
                      {mat.count} / {mat.max}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 'pinning' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <CharacterBubble
              message="짜인 친환경 바이오매트를 토양 사면에 안전하게 펼쳤어요! 대지를 더 든든하게 고정해 줄 '친환경 대나무 고정핀'을 땅에 꽉 박아주세요! (아래 버튼 연타!)"
              expression={pinCount === maxPins ? 'happy' : 'normal'}
            />

            {/* 사면 경사지 및 고정핀 애니메이션 */}
            <div className="relative h-44 bg-gradient-to-b from-sky-400 to-sky-600 rounded-3xl overflow-hidden shadow-2xl border-3 border-slate-200">
              {/* 태양 */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-yellow-300 rounded-full blur-[2px]" />

              {/* 경사진 사면 흙 */}
              <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 0 100 L 0 85 L 100 35 L 100 100 Z" fill="#78350f" /> {/* 흙 사면 */}
                
                {/* 생분해 바이오매트 깔려있음 (황토색 부드러운 망) */}
                <path d="M 0 85 L 100 35" stroke="#f59e0b" strokeWidth="5" strokeDasharray="3 1" opacity="0.9" />
              </svg>

              {/* 고정된 대나무 핀들의 시각화 */}
              {Array.from({ length: pinCount }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="absolute w-2.5 h-6 bg-emerald-600 rounded-full border border-emerald-800"
                  style={{
                    left: `${20 + (i * 15)}%`,
                    bottom: `${15 + (i * 7.5)}%`,
                    transform: 'rotate(-25deg)',
                  }}
                >
                  <div className="w-1 h-3 bg-emerald-400 mx-auto rounded-full mt-0.5" />
                </motion.div>
              ))}

              <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-1 rounded-lg text-[10px] font-black text-white border border-slate-700 flex items-center gap-1">
                <span>대나무 핀 개수: {pinCount} / {maxPins}개</span>
              </div>
            </div>

            {/* 고정핀 설치용 탭 버튼 */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePinTap}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-sm border-b-4 border-emerald-700 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              🎋 대나무 고정핀 망치질하기!
            </motion.button>
          </div>
        )}

        {step === 'complete' && (
          <div className="flex flex-col gap-4 text-center py-6 animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto border-3 border-green-500 text-green-600 shadow-md">
              <Check size={44} className="stroke-[3]" />
            </div>
            
            <h3 className="text-xl font-extrabold text-green-700">푸른 방패 설치 완료!</h3>
            
            <p className="text-xs text-slate-600 leading-relaxed max-w-[280px] mx-auto">
              옥수수대껍질, 볏짚, 황마를 촘촘히 엮고 친환경 대나무 핀으로 단단히 땅에 고정했습니다! 
              기존 플라스틱 매트와 달리 <strong>태우지 않고 땅에 서서히 녹아 새로운 자연 거름</strong>이 될 거예요.
            </p>

            <CharacterBubble
              message="정말 환상적이에요! 100% 생분해 푸른 방패가 완성되었습니다. 이제 비를 내리게 해 숨겨진 씨앗 캡슐을 깨워볼까요?"
              expression="excited"
            />
          </div>
        )}
      </div>

      {/* 하단 제어 버튼 */}
      <div className="pb-4">
        {step === 'weaving' && (
          <button
            onClick={handleNextStep}
            disabled={weavePercentage < 100}
            className={`w-full py-4 rounded-2xl font-black text-sm border-b-4 flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer ${
              weavePercentage < 100
                ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                : 'bg-green-500 border-green-700 hover:bg-green-400 text-white'
            }`}
          >
            <span>대나무 핀 설치로 넘어가기</span>
            <ChevronRight size={16} />
          </button>
        )}

        {step === 'complete' && (
          <button
            onClick={handleNextStep}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-green-950 rounded-2xl font-black text-sm border-b-4 border-yellow-600 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={16} className="fill-current" />
            보석 15개 받고 다음 단계로!
          </button>
        )}
      </div>
    </div>
  );
}
