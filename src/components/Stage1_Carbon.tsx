import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Flame, AlertCircle, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import CharacterBubble from './CharacterBubble';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface Stage1Props {
  onComplete: (gems: number) => void;
  onBack: () => void;
}

export default function Stage1_Carbon({ onComplete, onBack }: Stage1Props) {
  const [pollutionLevel, setPollutionLevel] = React.useState(0);
  const [gameState, setGameState] = React.useState<'play' | 'quiz' | 'result'>('play');
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [quizResult, setQuizResult] = React.useState<'correct' | 'wrong' | null>(null);

  // 플라스틱 매트 소각 터치 이벤트
  const handleBurn = () => {
    if (pollutionLevel < 100) {
      sound.playPop(); // 타는 귀여운 팝 효과음
      setPollutionLevel(prev => Math.min(prev + 20, 100));
    }
  };

  // 퀴즈 옵션
  const quizOptions = [
    '1kg당 1.2kg 탄소 배출',
    '1kg당 2.9kg 탄소 배출',
    '1kg당 5.0kg 탄소 배출',
  ];

  const handleQuizAnswer = (index: number) => {
    setSelectedOption(index);
    if (index === 1) { // 2.9kg이 정답
      sound.playSuccess();
      setQuizResult('correct');
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    } else {
      sound.playFailure();
      setQuizResult('wrong');
    }
  };

  const handleNext = () => {
    sound.playTap();
    if (gameState === 'play') {
      setGameState('quiz');
    } else if (gameState === 'quiz' && quizResult === 'correct') {
      onComplete(10); // 10 보석 추가하고 완료
    } else if (quizResult === 'wrong') {
      // 오답 시 재시도하도록 세팅
      setSelectedOption(null);
      setQuizResult(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950 text-white p-5 select-none relative overflow-hidden">
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
        <button onClick={onBack} className="p-1 hover:bg-slate-800 rounded-lg cursor-pointer">
          <ArrowLeft size={20} className="text-slate-400" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-green-400 block tracking-wider">UNIT 1</span>
          <span className="font-extrabold text-xs text-white">위기의 민둥산과 탄소 장막</span>
        </div>
      </div>

      {/* 대기 오염 배경 오버레이 (pollutionLevel에 따라 어둡고 탁해짐) */}
      <div 
        className="absolute inset-0 bg-slate-950 pointer-events-none transition-all duration-700"
        style={{
          opacity: pollutionLevel * 0.007,
          background: `radial-gradient(circle, rgba(74,85,104,1) ${pollutionLevel}%, rgba(15,23,42,1) 100%)`
        }}
      />

      {/* 메인 게임 영역 */}
      <div className="flex-1 flex flex-col justify-center my-4 gap-4 z-10">
        {gameState === 'play' && (
          <>
            <CharacterBubble 
              message={
                pollutionLevel === 0 
                  ? "안타깝게도 매년 5,000만 톤의 토사 유실을 막으려 기존 플라스틱 그물망을 덮어두고 있어요. 아래의 플라스틱 매트를 터치해 소각했을 때 무슨 일이 일어나는지 직접 확인해 보세요!"
                  : pollutionLevel < 100 
                  ? "콜록콜록! 플라스틱이 탈수록 하늘이 어두워져요! 더 눌러서 매트를 태워보세요."
                  : "하늘이 이중의 '탄소 장막'으로 완전히 뒤덮였어요! 소각 시 일산화탄소(CO)와 초미세먼지가 가득 차 심각한 대기오염을 유발해요. 이제 어떻게 이 문제를 풀지 퀴즈로 알아볼까요?"
              }
              expression={pollutionLevel === 0 ? 'normal' : pollutionLevel < 100 ? 'shocked' : 'sad'}
            />

            {/* 사면 경사지 비주얼라이저 */}
            <div className="relative h-44 bg-gradient-to-b from-sky-400 to-sky-600 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800">
              {/* 태양 */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-yellow-300 rounded-full blur-[2px]" />

              {/* 연기 입자 애니메이션 */}
              <AnimatePresence>
                {pollutionLevel > 0 && Array.from({ length: Math.floor(pollutionLevel / 10) }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 120, x: 100 + (i * 20), scale: 0.5 }}
                    animate={{ 
                      opacity: [0.2, 0.8, 0], 
                      y: [120, -20], 
                      x: [100 + (i * 20), 50 + (i * 30), 120 + (i * 15)],
                      scale: [0.8, 2, 3.5]
                    }}
                    transition={{ repeat: Infinity, duration: 2.5 + (i * 0.2), ease: 'easeOut' }}
                    className="absolute w-8 h-8 bg-slate-700/60 rounded-full blur-[6px] pointer-events-none"
                  />
                ))}
              </AnimatePresence>

              {/* 경사진 사면 흙 */}
              <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 0 100 L 0 85 L 100 35 L 100 100 Z" fill="#78350f" /> {/* 황토색 사면 */}
                
                {/* 플라스틱 그물망 피복 (빨간 플라스틱 망) */}
                {pollutionLevel < 100 && (
                  <path 
                    d="M 0 85 L 100 35" 
                    stroke="#ef4444" 
                    strokeWidth="3" 
                    strokeDasharray="4 2" 
                    opacity={1 - pollutionLevel / 100}
                  />
                )}
              </svg>

              {/* 불꽃 애니메이션 */}
              {pollutionLevel > 0 && pollutionLevel < 100 && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="absolute bottom-12 right-12 text-orange-500"
                >
                  <Flame size={32} className="fill-current" />
                </motion.div>
              )}

              {/* 대기오염 퍼센트 바 */}
              <div className="absolute top-2 left-2 bg-slate-900/80 px-2 py-1 rounded-lg text-[10px] font-black border border-slate-700 flex items-center gap-1">
                <AlertCircle size={10} className="text-red-400 animate-pulse" />
                <span>대기오염도: {pollutionLevel}%</span>
              </div>
            </div>

            {/* 터치 소각 버튼 */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBurn}
              disabled={pollutionLevel >= 100}
              className={`w-full py-4 rounded-2xl font-black text-sm border-b-4 flex items-center justify-center gap-2 shadow-lg transition-all ${
                pollutionLevel >= 100
                  ? 'bg-slate-800 border-slate-900 text-slate-500 cursor-not-allowed'
                  : 'bg-red-500 border-red-700 hover:bg-red-400 text-white cursor-pointer'
              }`}
            >
              <Flame size={18} />
              {pollutionLevel >= 100 ? '소각이 완료되었습니다!' : '플라스틱 매트 소각하기 (클릭!)'}
            </motion.button>
          </>
        )}

        {gameState === 'quiz' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <CharacterBubble 
              message="여기서 문제! 기존의 플라스틱 토양 그물망은 안타깝게도 전량 소각 처리가 불가피해요. 이때, 플라스틱 매트 1kg을 소각할 때 배출되는 이산화탄소량은 무려 얼마일까요?"
              expression={quizResult === 'correct' ? 'excited' : quizResult === 'wrong' ? 'sad' : 'normal'}
            />

            {/* 퀴즈 목록 */}
            <div className="flex flex-col gap-2.5">
              {quizOptions.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === 1; // 2.9kg가 정답
                
                let buttonStyle = "bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-200";
                if (selectedOption !== null) {
                  if (isSelected) {
                    buttonStyle = isCorrect 
                      ? "bg-green-500/20 border-green-500 text-green-300 font-bold" 
                      : "bg-red-500/20 border-red-500 text-red-300 font-bold";
                  } else if (isCorrect) {
                    buttonStyle = "bg-green-500/10 border-green-600/30 text-green-400/80";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => selectedOption === null && handleQuizAnswer(index)}
                    disabled={selectedOption !== null}
                    className={`w-full p-4 rounded-xl border-2 text-left text-xs transition-all flex items-center justify-between cursor-pointer ${buttonStyle}`}
                  >
                    <span>{option}</span>
                    {selectedOption !== null && isSelected && (
                      isCorrect ? <CheckCircle2 size={16} className="text-green-400" /> : <XCircle size={16} className="text-red-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 결과 말풍선 */}
            {quizResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  quizResult === 'correct' 
                    ? 'bg-green-950/50 border-green-500/30 text-green-200' 
                    : 'bg-red-950/50 border-red-500/30 text-red-200'
                }`}
              >
                {quizResult === 'correct' ? (
                  <p>🎉 <strong>정답입니다!</strong> 플라스틱 토양 덮개는 1kg 소각 시 약 <strong>2.9kg</strong>의 막대한 탄소를 내뿜어요! 이로 인해 공기가 오염되고 대지를 아프게 한답니다. 이제 푸르리의 해결책을 보러 가요!</p>
                ) : (
                  <p>😢 <strong>아쉽지만 오답이에요!</strong> 힌트: 생각보다 매우 막대한 대기 오염 탄소가 배출됩니다. 다시 한번 정답을 찾아보세요!</p>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* 하단 제어 버튼 */}
      <div className="z-10 pb-4 bg-slate-950/80 backdrop-blur-sm pt-2">
        {gameState === 'play' && (
          <button
            onClick={handleNext}
            disabled={pollutionLevel < 100}
            className={`w-full py-4 rounded-2xl font-black text-sm border-b-4 flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer ${
              pollutionLevel < 100
                ? 'bg-slate-800 border-slate-900 text-slate-500 cursor-not-allowed'
                : 'bg-green-500 border-green-700 hover:bg-green-400 text-slate-950'
            }`}
          >
            다음 미션 이동하기
          </button>
        )}

        {gameState === 'quiz' && (
          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className={`w-full py-4 rounded-2xl font-black text-sm border-b-4 flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer ${
              selectedOption === null
                ? 'bg-slate-800 border-slate-900 text-slate-500 cursor-not-allowed'
                : quizResult === 'correct'
                ? 'bg-green-500 border-green-700 hover:bg-green-400 text-slate-950'
                : 'bg-red-500 border-red-700 hover:bg-red-400 text-white'
            }`}
          >
            {quizResult === 'correct' ? (
              <span className="flex items-center gap-1">
                <Sparkles size={16} /> 보석 10개 받고 완료하기
              </span>
            ) : (
              '다시 도전하기'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
