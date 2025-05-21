import React from 'react';

// Define types for the response data
export type JsonResponse =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null
  | JsonResponse[]
  | { text: string };

interface SceneViewProps {
  scene: Record<string, unknown>;
  index: number;
}

function SceneView({ scene, index }: SceneViewProps) {
  return (
    <div className='bg-gray-50 p-4 rounded-md'>
      <h4 className='text-md font-semibold mb-2'>Scene {index + 1}</h4>

      {/* Prioritize displaying textContent and imagePrompt */}
      {'textContent' in scene && (
        <div className='mb-4 border-l-4 border-blue-400 pl-3 py-2 bg-blue-50 rounded'>
          <div className='font-medium mb-1'>Text Content:</div>
          <div className='text-gray-700 whitespace-pre-wrap'>
            {typeof scene.textContent === 'string'
              ? scene.textContent
              : String(scene.textContent)}
          </div>
        </div>
      )}

      {'imagePrompt' in scene && (
        <div className='mb-4 border-l-4 border-green-400 pl-3 py-2 bg-green-50 rounded'>
          <div className='font-medium mb-1'>Image Prompt:</div>
          <div className='text-gray-700 whitespace-pre-wrap'>
            {typeof scene.imagePrompt === 'string'
              ? scene.imagePrompt
              : String(scene.imagePrompt)}
          </div>
        </div>
      )}

      {/* Display other scene properties */}
      {Object.entries(scene).map(([sceneKey, sceneValue]) => {
        // Skip textContent and imagePrompt as they're already displayed above
        if (sceneKey === 'textContent' || sceneKey === 'imagePrompt')
          return null;

        return (
          <div key={sceneKey} className='mb-2'>
            <span className='font-medium'>{sceneKey}: </span>
            {typeof sceneValue === 'object' && sceneValue !== null ? (
              <div className='pl-4 mt-1'>
                <JsonRenderer data={sceneValue as JsonResponse} />
              </div>
            ) : (
              <div className='text-gray-700 whitespace-pre-wrap'>
                {String(sceneValue)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface JsonRendererProps {
  data: JsonResponse;
}

export function JsonRenderer({ data }: JsonRendererProps) {
  if (!data) return null;

  // Special handling for scenes with textContent and imagePrompt
  if (typeof data === 'object' && data !== null && 'scenes' in data) {
    return (
      <div className='space-y-4'>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className='border-b border-gray-200 pb-4'>
            <span className='font-semibold text-lg'>{key}: </span>
            {key === 'scenes' && Array.isArray(value) ? (
              <div className='mt-2 space-y-4'>
                {value.map((scene, index) => (
                  <SceneView key={index} scene={scene} index={index} />
                ))}
              </div>
            ) : typeof value === 'object' && value !== null ? (
              <div className='pl-4 mt-1'>
                <JsonRenderer data={value as JsonResponse} />
              </div>
            ) : (
              <span className='text-gray-700'>{String(value)}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Standard object rendering
  if (typeof data === 'object' && data !== null) {
    return (
      <div className='space-y-2'>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className='border-b border-gray-200 pb-2'>
            <span className='font-semibold'>{key}: </span>
            {typeof value === 'object' && value !== null ? (
              <div className='pl-4 mt-1'>
                <JsonRenderer data={value as JsonResponse} />
              </div>
            ) : (
              <span className='text-gray-700 whitespace-pre-wrap'>
                {String(value)}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return <span className='whitespace-pre-wrap'>{String(data)}</span>;
}
