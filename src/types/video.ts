// Types for video creation functionality

export type Scene = {
  description: string;
  textContent: string;
  imagePrompt: string;
  imageUrl?: string;
  visuals?: string;
  audio?: string;
  [key: string]: string | number | boolean | object | undefined;
};

export type VideoData = {
  title: string;
  scenes: Scene[];
  metadata?: {
    [key: string]: string | number | boolean | object | undefined;
  };
  [key: string]: string | number | boolean | object | Scene[] | undefined;
};

export type VideoStatus =
  | 'idle'
  | 'creating'
  | 'processing'
  | 'completed'
  | 'error';

export type DebugImageGeneration = {
  sceneIndex: number;
  success: boolean;
  imageUrl: string;
  timestamp: string;
  error?: string;
  scene?: string;
};

export interface VideoState {
  images: string[];
  audio: string;
  captions: object[];
  loading: boolean;
  showLoadingModal: boolean;
  loadingModalMessage: string;
  selectedStory: string;
  selectedStyle: string;
  videoTitle: string;
  videoData: VideoData | null;
  scenes: Scene[];
  status: VideoStatus;
  error: string;
  customPrompt: string;
  debugImageGeneration: DebugImageGeneration[];
}
