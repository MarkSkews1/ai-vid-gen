import React from 'react';
import { JsonRenderer, JsonResponse } from './JsonRenderer';

interface VideoResponseProps {
  videoData: JsonResponse;
  error: string | null;
}

export function VideoResponse({ videoData, error }: VideoResponseProps) {
  if (!videoData && !error) return null;

  return (
    <div className='space-y-4'>
      {error && (
        <div className='relative overflow-hidden bg-gradient-to-r from-destructive/10 via-destructive/5 to-destructive/10 backdrop-blur-sm border border-destructive/20 rounded-xl p-6 shadow-lg'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-destructive/10 to-transparent rounded-full blur-2xl' />
          <div className='relative flex items-center gap-3 mb-2'>
            <div className='p-2 bg-destructive/20 rounded-lg'>
              <svg
                className='w-5 h-5 text-destructive'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h4 className='font-semibold text-destructive'>Processing Error</h4>
          </div>
          <p className='text-destructive/80 text-sm leading-relaxed'>{error}</p>
        </div>
      )}

      {videoData && (
        <div className='relative overflow-hidden bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-emerald-100/40 backdrop-blur-sm border border-emerald-200/50 rounded-xl shadow-lg'>
          <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-200/20 to-transparent rounded-full blur-3xl' />
          <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-green-50/10 opacity-60' />

          <div className='relative p-6'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-3 bg-emerald-500/20 rounded-xl'>
                <svg
                  className='w-6 h-6 text-emerald-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div>
                <h3 className='text-xl font-semibold text-emerald-800'>
                  AI Response Generated
                </h3>
                <p className='text-emerald-600/80 text-sm'>
                  Successfully processed your video request
                </p>
              </div>
            </div>

            <div className='bg-white/60 backdrop-blur-sm border border-emerald-200/30 rounded-xl p-6 shadow-sm'>
              <JsonRenderer data={videoData} />
            </div>

            <details className='mt-6 group'>
              <summary className='cursor-pointer flex items-center justify-between p-4 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg border border-emerald-200/30 transition-all duration-200'>
                <span className='text-emerald-700 font-medium'>
                  View Raw JSON Response
                </span>
                <svg
                  className='w-5 h-5 text-emerald-600 transition-transform group-open:rotate-180'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </summary>
              <div className='mt-4 bg-slate-50/80 backdrop-blur-sm border border-slate-200/50 rounded-lg overflow-hidden'>
                <pre className='p-4 text-xs font-mono text-slate-700 overflow-auto max-h-80 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent'>
                  {JSON.stringify(videoData, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
