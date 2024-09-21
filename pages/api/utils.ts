import axios from "axios";
import type {NextApiRequest, NextApiResponse} from "next";
const apiKey = process.env.OPEN_API_KEY;
const apiUrl = 'https://api.openai.com/v1/chat/completions';

export async function callChatGPT(prompt: string) {
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'gpt-3.5-turbo', // Or 'gpt-4' depending on the version you want to use
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100, // Adjust based on your needs
        temperature: 0.7,  // Adjust for creativity
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    const result = response.data.choices[0].message.content;
    console.log('Response from GPT:', result);
    return result;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Record<string, string>>) {
  return res.status(200).json({  });
}