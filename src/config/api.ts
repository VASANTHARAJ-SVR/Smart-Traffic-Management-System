// API Configuration
export const API_CONFIG = {
  GEMINI_API_KEY: 'AIzaSyC4Kk9QxcLN250Ek6zGsNuDyRhPvkInD0w',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
};

// Helper function to check if API key is configured
export const isGeminiConfigured = () => {
  console.log('API Key present:', !!API_CONFIG.GEMINI_API_KEY);
  if (API_CONFIG.GEMINI_API_KEY) {
    console.log('API Key length:', API_CONFIG.GEMINI_API_KEY.length);
  }
  return !!API_CONFIG.GEMINI_API_KEY;
}; 