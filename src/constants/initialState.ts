import { VideoState } from '@/types/video';

// Default initial state for video context
export const initialState: VideoState = {
  images: [],
  audio: '',
  captions: [],
  loading: false,
  showLoadingModal: false,
  loadingModalMessage: 'Processing your request...',
  selectedStory: 'Inspirational Story',
  selectedStyle: 'gta',
  videoTitle: '',
  videoData: null,
  scenes: [],
  status: 'idle',
  error: '',
  customPrompt: 'Create a short video about nature and wildlife',
  debugImageGeneration: [],
  useMockAudio: false,
  useMockCaptions: false,
};
