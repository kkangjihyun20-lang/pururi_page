import React from 'react';
import { motion } from 'motion/react';
import { Award, Heart, Sparkles, Share2, Check, Download, Landmark } from 'lucide-react';
import CharacterBubble from './CharacterBubble';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface Stage4Props {
  userName: string;
  voteCount: number;
  userVoted: boolean;
  onVote: () => void;
  onComplete: () => void;
}

export default function Stage4_Vote({
  userName,
  voteCount,
  userVoted,
  onVote,
  onComplete,
}: Stage4Props) {
  const [pledgeChecked, setPledgeChecked] = React.useState(false);
  const [showCertificate, setShowCertificate] = React.useState(false);

  const handleVoteClick = () => {
    if (!userVoted) {
      sound.playSuccess();
      onVote();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePledgeChange = (checked: boolean) => {
    sound.playTap();
    setPledgeChecked(checked);
  };

  const handleIssueCertificate = () => {
    if (pledgeChecked) {
      sound.playFanfare();
      if (!userVoted) {
        onVote(); // 서약 동의 시 자동으로 투표를 함께 진행하여 사용자 차단을 방지합니다
      }
      setShowCertificate(true);
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.5 }
      });
    }
  };

  const handleFinish = () => {
    sound.playTap();
    onComplete();
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 text-slate-800 p-5 select-none relative overflow-hidden">
      
      {/* 상단 네비게이션 */}
      <div className="bg-white p-3 rounded-2xl border-2 border-slate-200 text-center relative">
        <span className="text-[10px] font-bold text-green-600 block tracking-wider">UNIT 4</span>
        <span className="font-extrabold text-xs text-slate-800">푸르리 온라인 투표 & 서약</span>
      </div>

      {/* 메인 화면 영역 */}
      <div className="flex-1 flex flex-col justify-center my-4 gap-4 overflow-y-auto max-h-[580px] pr-1">
        {!showCertificate ? (
          <>
            <CharacterBubble
              message={`마지막 관문이에요, ${userName}님! 저희 '푸르리' 팀이 BMW 영 이노베이터 드림 프로젝트 2026 환경부문 본선에 당당히 합격할 수 있도록 응원 투표를 꾹 눌러주시고, 지구 지킴이 서약에 참여해 주세요!`}
              expression="excited"
            />

            {/* 1. 온라인 응원 투표 카드 */}
            <div className="bg-white border-3 border-green-500 rounded-2xl p-4 shadow-md text-center relative overflow-hidden">
              <div className="absolute top-[-10px] right-[-10px] text-green-100 transform rotate-12">
                <Landmark size={80} />
              </div>

              <span className="bg-green-100 text-green-800 font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
                YIDP 2026 푸르리 응원관
              </span>
              
              <h3 className="text-base font-extrabold text-slate-800 mt-2">
                &quot;푸르리&quot; 팀에게 소중한 한 표를!
              </h3>
              
              <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
                농업 폐자원을 완벽한 친환경 생물 다양성 복원 바이오매트로 재탄생시킨 푸르리를 적극 투표해 주세요!
              </p>

              {/* 투표 수 카운터 */}
              <div className="my-4 flex items-center justify-center gap-1.5 bg-slate-50 py-3 rounded-xl border border-slate-200">
                <Heart size={20} className={`fill-current text-rose-500 ${userVoted ? 'animate-bounce' : 'animate-pulse'}`} />
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase leading-none">현재 득표수</span>
                  <span className="font-black text-slate-800 text-xl tracking-tight">
                    {voteCount.toLocaleString()}표
                  </span>
                </div>
              </div>

              {/* 투표 버튼 */}
              <motion.button
                whileTap={!userVoted ? { scale: 0.95 } : {}}
                onClick={handleVoteClick}
                className={`w-full py-3 rounded-xl font-black text-xs border-b-4 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  userVoted
                    ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed'
                    : 'bg-rose-500 border-rose-700 hover:bg-rose-400 text-white'
                }`}
              >
                {userVoted ? (
                  <>
                    <Check size={16} />
                    <span>투표를 완료하셨습니다! 감사합니다 💚</span>
                  </>
                ) : (
                  <>
                    <Heart size={16} className="fill-current" />
                    <span>푸르리 팀에게 투표하기!</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* 2. 환경 서약서 작성 카드 */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm">
              <h4 className="text-xs font-black text-slate-800 mb-2 flex items-center gap-1">
                🌱 100% 생분해 환경 실천 서약
              </h4>
              
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                지구의 토양 유실을 막고 플라스틱 정화를 위해 아래 환경 수칙을 함께 실천할 것을 서약하시겠습니까?
              </p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex flex-col gap-1.5">
                <div className="flex items-start gap-1.5">
                  <span className="text-green-600 font-bold">1.</span>
                  <span>야외 등산이나 여가 시 자연 흙 사면을 훼손하지 않습니다.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-green-600 font-bold">2.</span>
                  <span>지구 온난화를 늦추기 위해 일회용 플라스틱 배출을 줄입니다.</span>
                </div>
              </div>

              {/* 동의 체크박스 */}
              <label className="flex items-center gap-2 mt-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pledgeChecked}
                  onChange={(e) => handlePledgeChange(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                />
                <span className="text-xs font-black text-slate-700">
                  네, 지구를 지킬 것을 약속하고 서약합니다!
                </span>
              </label>
            </div>
          </>
        ) : (
          /* 발급된 수료증 화면 */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col gap-4 animate-fade-in text-center py-4"
          >
            {/* 실제 다운로드/캡처하기 좋은 클래식 수료증 디자인 */}
            <div className="bg-amber-50 border-8 border-double border-amber-800 p-6 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
              {/* 기품있는 모서리 장식 */}
              <div className="absolute top-2 left-2 text-amber-800/40 text-xs font-serif">◆</div>
              <div className="absolute top-2 right-2 text-amber-800/40 text-xs font-serif">◆</div>
              <div className="absolute bottom-2 left-2 text-amber-800/40 text-xs font-serif">◆</div>
              <div className="absolute bottom-2 right-2 text-amber-800/40 text-xs font-serif">◆</div>

              {/* 상단 엠블럼 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-amber-800/10 rounded-full flex items-center justify-center border border-amber-800/30 text-amber-900 mb-1">
                  <Award size={28} className="stroke-[1.5]" />
                </div>
                <span className="text-[9px] font-black tracking-widest text-amber-800 font-serif uppercase">
                  Certificate of eco-guardian
                </span>
                <h3 className="text-lg font-black text-amber-950 font-serif mt-1">
                  환경 지킴이 수료증
                </h3>
              </div>

              {/* 본문 명세 */}
              <div className="my-6">
                <span className="text-[10px] text-amber-800 font-serif block">성명</span>
                <span className="text-xl font-extrabold text-amber-950 border-b border-amber-800/30 px-6 pb-0.5 inline-block">
                  {userName} 님
                </span>

                <p className="text-xs text-amber-900 leading-relaxed font-serif mt-4 px-2">
                  귀하는 BMW 영 이노베이터 드림 프로젝트 2026 환경 부문의 &apos;푸르리&apos; 친환경 토양 보호 솔루션을 이수하고, 100% 생분해 바이오매트 가치에 전폭적으로 공감하여 지구 환경 보전에 앞장설 것을 서약하였으므로 이 증서를 수여합니다.
                </p>
              </div>

              {/* 하단 단체 직인 */}
              <div className="flex justify-between items-end border-t border-amber-800/20 pt-4 text-left">
                <div>
                  <span className="block text-[8px] text-amber-700/80 font-serif">BMW YIDP 2026 환경부문</span>
                  <span className="text-[10px] font-black text-amber-950 font-serif tracking-tight">
                    푸르리(Pureuri) 개발 연대
                  </span>
                </div>
                
                {/* 붉은 직인 마크 */}
                <div className="w-9 h-9 border-2 border-red-600 rounded-lg flex items-center justify-center text-red-600 font-black text-[9px] rotate-[-5deg] leading-none text-center">
                  푸르리<br />인증
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              💡 팁: 위 수료증 화면을 길게 누르거나 화면을 캡처해서 소장해 보세요!
            </p>
          </motion.div>
        )}
      </div>

      {/* 하단 제어 버튼 */}
      <div className="pb-4">
        {!showCertificate ? (
          <button
            onClick={handleIssueCertificate}
            disabled={!pledgeChecked}
            className={`w-full py-4 rounded-2xl font-black text-sm border-b-4 flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer ${
              !pledgeChecked
                ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                : 'bg-green-500 border-green-700 hover:bg-green-400 text-white'
            }`}
          >
            <Award size={18} />
            <span>친환경 지킴이 수료증 발급하기</span>
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-green-950 rounded-2xl font-black text-sm border-b-4 border-yellow-600 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check size={18} />
            <span>모든 체험 완료하고 홈으로 가기</span>
          </button>
        )}
      </div>
    </div>
  );
}
