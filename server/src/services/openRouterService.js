const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.io/api/v1/chat/completions';

class OpenRouterService {
  constructor() {
    this.model = 'meta-llama/llama-2-70b-chat';
    this.systemPrompt = `You are a helpful medical assistant chatbot for a hospital management system. Your role is to:
1. Help patients understand their symptoms and provide general health information
2. Ask clarifying questions about symptoms to help identify possible conditions
3. Provide information about prescribed medicines and their usage
4. Answer general health and wellness questions
5. Suggest when patients should see a doctor

IMPORTANT: Always remind patients that you are NOT a substitute for professional medical advice and they should consult with a doctor for proper diagnosis and treatment.

When analyzing symptoms:
- Ask follow-up questions to understand the severity and duration
- Provide a list of possible conditions (with confidence levels)
- Recommend when to seek immediate medical attention
- Suggest lifestyle modifications if appropriate

When discussing medicines:
- Explain what the medicine is for
- Describe common side effects
- Explain proper usage and dosage
- Warn about potential interactions

Keep responses concise, friendly, and easy to understand.`;
  }

  async sendMessage(userMessage, conversationHistory = []) {
    try {
      const messages = [
        ...conversationHistory,
        {
          role: 'user',
          content: userMessage,
        },
      ];

      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: this.model,
          messages: messages,
          system: this.systemPrompt,
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Hospital Management System',
          },
        }
      );

      return {
        success: true,
        message: response.data.choices[0].message.content,
        usage: response.data.usage,
      };
    } catch (error) {
      console.error('OpenRouter API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Failed to get response from AI',
      };
    }
  }

  async analyzeSymptomsForDiseases(symptoms) {
    const prompt = `Based on the following symptoms, provide a list of possible diseases/conditions with confidence levels (0-100):

Symptoms: ${symptoms}

Please format your response as a JSON array with objects containing:
- disease: name of the disease
- confidence: confidence level (0-100)
- description: brief description of the disease

Respond ONLY with valid JSON, no other text.`;

    try {
      const response = await this.sendMessage(prompt);
      if (response.success) {
        try {
          const diseases = JSON.parse(response.message);
          return {
            success: true,
            diseases: diseases,
          };
        } catch (e) {
          return {
            success: true,
            diseases: [],
            rawResponse: response.message,
          };
        }
      }
      return response;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to analyze symptoms',
      };
    }
  }

  async getMedicineInfo(medicineName) {
    const prompt = `Provide information about the medicine "${medicineName}" in the following format:
- What it's used for
- Common side effects
- Proper usage and dosage
- Important warnings or interactions

Keep the response concise and easy to understand for patients.`;

    return this.sendMessage(prompt);
  }
}

module.exports = new OpenRouterService();

