export type ScreenType = 'intro' | 'lobby' | 'stage1' | 'stage2' | 'stage3' | 'stage4';

export interface GameState {
  currentScreen: ScreenType;
  completedStages: {
    stage1: boolean;
    stage2: boolean;
    stage3: boolean;
    stage4: boolean;
  };
  gems: number; // 듀오링고 보석 스타일
  streak: number; // 연속 학습 일수 스타일
  hearts: number; // 목숨 (기본 5개)
  voteCount: number; // 응원 투표 수 (모의 투표)
  userVoted: boolean; // 투표 여부
  userName: string; // 수료증용 사용자 이름
  certifiedAt: string; // 수료증 발급일
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
