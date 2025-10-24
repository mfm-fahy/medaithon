const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.io/api/v1/chat/completions';

class OpenRouterService {
  constructor() {
    this.model = 'meta-llama/llama-2-70b-chat';
    this.systemPrompt = `You are a helpful and friendly AI assistant for a hospital management system. Your role is to:
1. Answer questions on a wide variety of topics including health, wellness, general knowledge, and more
2. Help patients understand their symptoms and provide general health information
3. Ask clarifying questions when needed to provide better assistance
4. Provide information about prescribed medicines and their usage
5. Answer general health and wellness questions
6. Assist with appointment scheduling, hospital information, and patient care questions
7. Provide friendly conversation and support

IMPORTANT: When discussing medical topics:
- Always remind patients that you are NOT a substitute for professional medical advice
- Suggest consulting with a doctor for proper diagnosis and treatment
- For emergency situations, recommend immediate medical attention

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

General Guidelines:
- Be helpful, friendly, and professional
- Keep responses concise and easy to understand
- Use simple language
- Ask clarifying questions when needed
- Provide accurate information
- Be honest about limitations

You can answer questions about:
- Health and wellness
- Hospital services
- Appointment information
- General knowledge
- Wellness tips
- Lifestyle advice
- And much more!`;
  }

  async sendMessage(userMessage, conversationHistory = []) {
    try {
      // Check if API key is available
      if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.trim() === '') {
        console.warn('⚠️ No OpenRouter API key found in environment variables');
        console.warn('⚠️ Using fallback response');
        return {
          success: true,
          message: this.getFallbackResponse(userMessage),
          usage: { fallback: true, reason: 'No API key' },
        };
      }

      const messages = [
        ...conversationHistory,
        {
          role: 'user',
          content: userMessage,
        },
      ];

      console.log('🔌 Connecting to OpenRouter API...');
      console.log('📊 Request details:', {
        model: this.model,
        messagesCount: messages.length,
        userMessageLength: userMessage.length,
        apiKeyPresent: !!OPENROUTER_API_KEY,
      });

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
          timeout: 30000, // 30 second timeout
        }
      );

      console.log('✅ OpenRouter API response received successfully');
      console.log('📊 Response details:', {
        tokensUsed: response.data.usage?.total_tokens,
        model: response.data.model,
      });

      return {
        success: true,
        message: response.data.choices[0].message.content,
        usage: response.data.usage,
      };
    } catch (error) {
      console.error('❌ OpenRouter API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      console.warn('⚠️ API error occurred, using fallback response');

      // Fallback response on API error
      return {
        success: true,
        message: this.getFallbackResponse(userMessage),
        usage: { fallback: true, error: error.message },
      };
    }
  }

  getFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    // Health-related responses
    if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('ache')) {
      return "I'm sorry to hear you're experiencing discomfort. Please describe your symptoms in detail when you see your doctor, including when it started, how severe it is, and any factors that make it better or worse. They can provide the appropriate guidance. In the meantime, rest and over-the-counter pain relievers may help.";
    }

    if (lowerMessage.includes('medicine') || lowerMessage.includes('medication') || lowerMessage.includes('drug')) {
      return "Regarding medications, always follow your doctor's instructions carefully. If you have questions about your prescriptions, please contact your doctor or pharmacist directly for clarification. Never change your medication without consulting your healthcare provider.";
    }

    if (lowerMessage.includes('symptom') || lowerMessage.includes('fever') || lowerMessage.includes('cough')) {
      return "Tracking your symptoms is a good step. Please share this information with your healthcare provider during your next visit. They can help interpret what these symptoms might mean for your health. Keep a record of when symptoms started and how they've progressed.";
    }

    if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('visit')) {
      return "I can help you with appointment information. Please contact our hospital reception or use the appointment booking system to schedule your visit. Make sure to provide your patient ID and preferred date/time.";
    }

    if (lowerMessage.includes('hospital') || lowerMessage.includes('doctor') || lowerMessage.includes('clinic')) {
      return "Our hospital is here to serve you with quality healthcare. You can reach us during business hours, and our staff will be happy to assist you with any questions about our services, departments, or facilities.";
    }

    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('911')) {
      return "If this is a medical emergency, please call emergency services (911) or go to the nearest emergency room immediately. Do not wait for online assistance in emergency situations.";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 👋 I'm your hospital assistant. I'm here to help you with questions about your health, appointments, hospital services, and general wellness. How can I assist you today?";
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're welcome! I'm happy to help. If you have any other questions or need further assistance, feel free to ask. I'm here to support you!";
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
      return "Of course! I'm here to help. I can assist you with:\n- Health and wellness questions\n- Appointment scheduling\n- Hospital information\n- General medical knowledge\n- Symptom tracking\n- And much more!\n\nWhat would you like help with?";
    }

    // General responses for other topics
    const generalResponses = [
      "That's an interesting question! I'm here to help with health-related topics, hospital services, and general wellness. Feel free to ask me anything about your health or our hospital services.",
      "I appreciate your question. While I specialize in health and hospital-related topics, I'm happy to help with any questions you might have. What would you like to know?",
      "Great question! I'm your hospital assistant and I'm here to provide information and support. Is there anything specific about your health or our services I can help you with?",
      "I'm here to assist you! Whether it's about your health, appointments, or hospital services, I'm ready to help. What can I do for you?",
      "Thank you for reaching out! I'm your AI assistant for the hospital management system. I can help with health questions, appointments, and general information. How can I assist you today?",
    ];

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
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

  async analyzeSymptoms(symptoms) {
    try {
      console.log('🔍 Analyzing symptoms:', symptoms);

      const prompt = `You are a medical diagnostic assistant. Analyze the following symptoms and provide a detailed analysis:

SYMPTOMS: ${symptoms}

Please provide your analysis in the following format:

**POSSIBLE CONDITIONS:**
1. [Condition Name] - Confidence: [X]%
   - Description: [Brief description]
   - Causes: [List main causes]
   - Risk Level: [Low/Medium/High]

2. [Condition Name] - Confidence: [X]%
   - Description: [Brief description]
   - Causes: [List main causes]
   - Risk Level: [Low/Medium/High]

3. [Condition Name] - Confidence: [X]%
   - Description: [Brief description]
   - Causes: [List main causes]
   - Risk Level: [Low/Medium/High]

**COMMON CAUSES:**
- [Cause 1]
- [Cause 2]
- [Cause 3]

**RECOMMENDED ACTIONS:**
- [Action 1]
- [Action 2]
- [Action 3]

**WHEN TO SEEK IMMEDIATE MEDICAL ATTENTION:**
- [Warning sign 1]
- [Warning sign 2]
- [Warning sign 3]

**IMPORTANT DISCLAIMER:**
This analysis is for informational purposes only and is NOT a substitute for professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.`;

      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a medical diagnostic assistant. Provide detailed symptom analysis with possible conditions, causes, and recommendations.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Hospital Management System',
          },
          timeout: 30000,
        }
      );

      const analysis = response.data.choices[0].message.content;
      console.log('✅ Symptom analysis completed');

      return {
        success: true,
        analysis: analysis,
        usage: response.data.usage,
      };
    } catch (error) {
      console.error('❌ Error analyzing symptoms:', error.message);
      return {
        success: false,
        error: 'Failed to analyze symptoms',
        analysis: this.getFallbackSymptomAnalysis(symptoms),
      };
    }
  }

  getFallbackSymptomAnalysis(symptoms) {
    return `**SYMPTOM ANALYSIS - GENERAL INFORMATION**

Based on your symptoms: "${symptoms}"

**POSSIBLE CONDITIONS:**
1. Common Cold/Flu - Confidence: 40%
   - Description: Viral infection affecting respiratory system
   - Causes: Viral infection, exposure to infected individuals
   - Risk Level: Low

2. Allergies - Confidence: 30%
   - Description: Immune system reaction to allergens
   - Causes: Environmental allergens, food allergies, seasonal changes
   - Risk Level: Low

3. Other Conditions - Confidence: 30%
   - Description: Various other conditions could cause these symptoms
   - Causes: Multiple possible causes
   - Risk Level: Varies

**COMMON CAUSES:**
- Viral or bacterial infection
- Allergic reactions
- Environmental factors
- Stress or fatigue
- Underlying medical conditions

**RECOMMENDED ACTIONS:**
- Rest and stay hydrated
- Monitor your symptoms
- Avoid close contact with others if contagious
- Take over-the-counter medications as needed
- Maintain good hygiene

**WHEN TO SEEK IMMEDIATE MEDICAL ATTENTION:**
- Severe difficulty breathing
- Chest pain or pressure
- Confusion or difficulty thinking clearly
- Severe headache with stiff neck
- High fever (above 103°F/39.4°C)
- Symptoms worsening rapidly

**IMPORTANT DISCLAIMER:**
This is general information only and NOT a substitute for professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.`;
  }
}

module.exports = new OpenRouterService();

