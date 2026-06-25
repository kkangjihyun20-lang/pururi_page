import React from 'react';
import { GameState } from './types';
import MobileFrame from './components/MobileFrame';
import IntroScreen from './components/IntroScreen';
import GamePath from './components/GamePath';
import Stage1_Carbon from './components/Stage1_Carbon';
import Stage2_BioMat from './components/Stage2_BioMat';
import Stage3_RainForest from './components/Stage3_RainForest';
import Stage4_Vote from './components/Stage4_Vote';

const LOCAL_STORAGE_KEY = 'pureuri_yidp2026_state';

// 초기 모의 투표 수 세팅
const INITIAL_VOTE_COUNT = 1324;

export default function App() {
  const [gameState, setGameState] = React.useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading localStorage state', e);
    }

    return {
      currentScreen: 'intro',
      completedStages: {
        stage1: false,
        stage2: false,
        stage3: false,
        stage4: false,
      },
      gems: 0,
      streak: 1,
      hearts: 5,
      voteCount: INITIAL_VOTE_COUNT,
      userVoted: false,
      userName: '',
      certifiedAt: '',
    };
  });

  // 상태 변경 시 로컬 스토리지에 자동 저장
  React.useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
  }, [gameState]);

  // 게임 초기화
  const handleReset = () => {
    setGameState({
      currentScreen: 'intro',
      completedStages: {
        stage1: false,
        stage2: false,
        stage3: false,
        stage4: false,
      },
      gems: 0,
      streak: 1,
      hearts: 5,
      voteCount: INITIAL_VOTE_COUNT,
      userVoted: false,
      userName: '',
      certifiedAt: '',
    });
  };

  const handleStartGame = (name: string) => {
    setGameState(prev => ({
      ...prev,
      userName: name,
      currentScreen: 'lobby',
    }));
  };

  const handleSelectStage = (stage: 'stage1' | 'stage2' | 'stage3' | 'stage4') => {
    setGameState(prev => ({
      ...prev,
      currentScreen: stage,
    }));
  };

  const handleCompleteStage1 = (earnedGems: number) => {
    setGameState(prev => ({
      ...prev,
      gems: prev.gems + earnedGems,
      completedStages: {
        ...prev.completedStages,
        stage1: true,
      },
      currentScreen: 'lobby',
    }));
  };

  const handleCompleteStage2 = (earnedGems: number) => {
    setGameState(prev => ({
      ...prev,
      gems: prev.gems + earnedGems,
      completedStages: {
        ...prev.completedStages,
        stage2: true,
      },
      currentScreen: 'lobby',
    }));
  };

  const handleCompleteStage3 = (earnedGems: number) => {
    setGameState(prev => ({
      ...prev,
      gems: prev.gems + earnedGems,
      completedStages: {
        ...prev.completedStages,
        stage3: true,
      },
      currentScreen: 'lobby',
    }));
  };

  const handleVote = () => {
    setGameState(prev => ({
      ...prev,
      userVoted: true,
      voteCount: prev.voteCount + 1,
      gems: prev.gems + 30, // 투표 보너스 보석!
    }));
  };

  const handleCompleteStage4 = () => {
    setGameState(prev => ({
      ...prev,
      completedStages: {
        ...prev.completedStages,
        stage4: true,
      },
      currentScreen: 'lobby',
    }));
  };

  const handleBackToLobby = () => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'lobby',
    }));
  };

  // 현재 화면 라우팅 처리
  const renderScreen = () => {
    switch (gameState.currentScreen) {
      case 'intro':
        return <IntroScreen onStart={handleStartGame} />;
      case 'lobby':
        return (
          <GamePath
            gameState={gameState}
            onSelectStage={handleSelectStage}
            onReset={handleReset}
          />
        );
      case 'stage1':
        return (
          <Stage1_Carbon
            onComplete={handleCompleteStage1}
            onBack={handleBackToLobby}
          />
        );
      case 'stage2':
        return (
          <Stage2_BioMat
            onComplete={handleCompleteStage2}
            onBack={handleBackToLobby}
          />
        );
      case 'stage3':
        return (
          <Stage3_RainForest
            onComplete={handleCompleteStage3}
            onBack={handleBackToLobby}
          />
        );
      case 'stage4':
        return (
          <Stage4_Vote
            userName={gameState.userName}
            voteCount={gameState.voteCount}
            userVoted={gameState.userVoted}
            onVote={handleVote}
            onComplete={handleCompleteStage4}
          />
        );
      default:
        return <IntroScreen onStart={handleStartGame} />;
    }
  };

  return (
    <MobileFrame>
      {renderScreen()}
    </MobileFrame>
  );
}
