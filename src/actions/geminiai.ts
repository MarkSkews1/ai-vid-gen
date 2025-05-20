import { GoogleGenAI } from '@google/genai';

const defaultMessage =
  "Create a 30-SECOND long ADVENTURE STORY video script. Include AI image prompts in FANTASY FORMAT for each scene in realistic format. Provide the result in JSON format with 'imagePrompt' and 'textContent' fields.";

export async function createVideoAi(message: string) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-2.5-pro-preview-05-06';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: message || defaultMessage,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  for await (const chunk of response) {
    console.log(chunk.text);
    const result = chunk.text;
    if (result) {
      const json = JSON.parse(result);
      console.log(json);
      return json;
    }
  }
}
