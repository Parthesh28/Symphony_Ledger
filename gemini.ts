import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyD4isPMQ7t7nPMCzj5rWG1e-volGN4_CKE');

export async function analyzeAudioContent(audioText: string): Promise<{
  isExplicit: boolean;
  reason?: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze the following audio content for explicit content. Consider profanity, adult themes, violence, and inappropriate content. Respond with a JSON object containing 'isExplicit' (boolean) and 'reason' (string explaining why if explicit). Content to analyze: "${audioText}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch (e) {
      // If parsing fails, make a best effort to determine if content is explicit
      const isExplicit = text.toLowerCase().includes('explicit') || 
                        text.toLowerCase().includes('inappropriate');
      return {
        isExplicit,
        reason: isExplicit ? 'Content may contain inappropriate material' : undefined
      };
    }
  } catch (error) {
    console.error('Error analyzing content:', error);
    return {
      isExplicit: false,
      reason: 'Unable to analyze content'
    };
  }
}