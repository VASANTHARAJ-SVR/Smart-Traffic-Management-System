import { API_CONFIG } from '../config/api';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const getGeminiResponse = async (message: string): Promise<string> => {
  console.log('Attempting to call Gemini API...');
  
  if (!API_CONFIG.GEMINI_API_KEY) {
    console.error('Gemini API key is missing');
    throw new Error('Gemini API key not configured');
  }

  try {
    const url = `${API_CONFIG.GEMINI_API_URL}?key=${API_CONFIG.GEMINI_API_KEY}`;
    console.log('Making API request to:', url);
    
    const requestBody = {
      contents: [{
        parts: [{
          text: message
        }]
      }]
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log('Raw API Response:', responseText);

    if (!response.ok) {
      console.error('API Error Response:', responseText);
      throw new Error(`API request failed with status ${response.status}: ${responseText}`);
    }

    let data: GeminiResponse;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing API response:', parseError);
      throw new Error('Invalid JSON response from API');
    }

    console.log('Parsed API response:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}; 