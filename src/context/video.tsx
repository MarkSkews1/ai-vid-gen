'use client';

import {
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react';

const initialState = {
  script:
    "Create a 30-SECOND long ADVENTURE STORY video script. Include AI image prompts in FANTASY FORMAT for each scene in realistic format. Return ONLY a valid JSON array where each object has 'imagePrompt' and 'textContent' fields. Do not include any explanations or markdown formatting.",
  images: [] as string[],
  audio: '',
  captions: [] as object[],
  loading: false,
};

interface VideoContextType {
  script: string;
  setScript: Dispatch<SetStateAction<string>>;
  images: string[];
  setImages: Dispatch<SetStateAction<string[]>>;
  audio: string;
  setAudio: Dispatch<SetStateAction<string>>;
  captions: object[];
  setCaptions: Dispatch<SetStateAction<object[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [script, setScript] = useState(initialState.script);
  const [images, setImages] = useState(initialState.images);
  const [audio, setAudio] = useState(initialState.audio);
  const [captions, setCaptions] = useState(initialState.captions);
  const [loading, setLoading] = useState(initialState.loading);

  return (
    <VideoContext.Provider
      value={{
        script,
        setScript,
        images,
        setImages,
        audio,
        setAudio,
        captions,
        setCaptions,
        loading,
        setLoading,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};
