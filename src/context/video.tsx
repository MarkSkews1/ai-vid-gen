'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  ChangeEvent,
} from 'react';

const initialState = {
  script: 'Script...',
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
  //state
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
  if (context === undefined) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};
