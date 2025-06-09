import { Scene } from '@/types/video';
import { PlayerRef } from '@remotion/player';

export interface CaptionStyle {
  backgroundColor: string;
  textColor: string;
  fontSize: string;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  showCaptions: boolean;
  captionStyle: CaptionStyle;
}

export interface AudioValidationState {
  [index: number]: 'pending' | 'valid' | 'invalid' | 'error';
}

export interface SceneCalculation {
  activeIndex: number;
  offsetTime: number;
  cumulativeTime: number;
  sceneDurations: number[];
  totalDuration: number;
  activeScene: Scene;
}

export interface VideoPlayerProps {
  scenes: Scene[];
}

export interface VideoSyncHookReturn {
  playerRef: React.RefObject<PlayerRef | null>;
  syncVideoWithAudio: (audioTime: number, cumulativeTime: number) => void;
}

export interface SceneNavigationHookReturn {
  sceneCalculation: SceneCalculation;
  goToNextScene: () => void;
  setCurrentTime: (time: number) => void;
}
