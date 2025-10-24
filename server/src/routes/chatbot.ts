import express, { Response } from 'express';
import { ChatSession } from '../models/ChatSession';
import { Patient } from '../models/Patient';
import { AuthRequest, authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

// Get or create chat session for patient
router.get('/session', authMiddleware, roleMiddleware(['patient']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patientId = req.userId;

    // Find existing active session
    let session = await ChatSession.findOne({
      patientId,
      status: 'active',
    });

    // If no active session, create new one
    if (!session) {
      session = new ChatSession({
        patientId,
        messages: [],
        symptoms: [],
        possibleDiseases: [],
        medicineQuestions: [],
        status: 'active',
      });
      await session.save();
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat session', error });
  }
});

// Send message to chatbot
router.post('/message', authMiddleware, roleMiddleware(['patient']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, sessionId } = req.body;
    const patientId = req.userId;

    if (!message || !sessionId) {
      res.status(400).json({ message: 'Message and sessionId are required' });
      return;
    }

    // Find session
    const session = await ChatSession.findById(sessionId);
    if (!session || session.patientId.toString() !== patientId) {
      res.status(404).json({ message: 'Chat session not found' });
      return;
    }

    // Add user message
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Call OpenRouter API for AI response
    const aiResponse = await callOpenRouterAPI(message, session.messages, session.symptoms);

    // Add assistant message
    session.messages.push({
      role: 'assistant',
      content: aiResponse.response,
      timestamp: new Date(),
    });

    // Update symptoms if detected
    if (aiResponse.symptoms && aiResponse.symptoms.length > 0) {
      session.symptoms = [...new Set([...session.symptoms, ...aiResponse.symptoms])];
    }

    // Update possible diseases if detected
    if (aiResponse.possibleDiseases && aiResponse.possibleDiseases.length > 0) {
      session.possibleDiseases = aiResponse.possibleDiseases;
    }

    // Update medicine questions if detected
    if (aiResponse.medicineQuestions && aiResponse.medicineQuestions.length > 0) {
      session.medicineQuestions = [...new Set([...session.medicineQuestions, ...aiResponse.medicineQuestions])];
    }

    await session.save();

    res.json({
      message: aiResponse.response,
      symptoms: session.symptoms,
      possibleDiseases: session.possibleDiseases,
      medicineQuestions: session.medicineQuestions,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error processing message', error });
  }
});

// Get chat history
router.get('/history/:sessionId', authMiddleware, roleMiddleware(['patient']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const patientId = req.userId;

    const session = await ChatSession.findById(sessionId);
    if (!session || session.patientId.toString() !== patientId) {
      res.status(404).json({ message: 'Chat session not found' });
      return;
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history', error });
  }
});

// Get patient symptoms (for doctor)
router.get('/patient/:patientId/symptoms', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;

    // Get latest chat session with symptoms
    const session = await ChatSession.findOne({
      patientId,
    }).sort({ createdAt: -1 });

    if (!session) {
      res.json({
        symptoms: [],
        possibleDiseases: [],
        medicineQuestions: [],
      });
      return;
    }

    res.json({
      symptoms: session.symptoms,
      possibleDiseases: session.possibleDiseases,
      medicineQuestions: session.medicineQuestions,
      lastUpdated: session.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient symptoms', error });
  }
});

// Close chat session
router.post('/session/:sessionId/close', authMiddleware, roleMiddleware(['patient']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const patientId = req.userId;

    const session = await ChatSession.findById(sessionId);
    if (!session || session.patientId.toString() !== patientId) {
      res.status(404).json({ message: 'Chat session not found' });
      return;
    }

    session.status = 'closed';
    await session.save();

    res.json({ message: 'Chat session closed', session });
  } catch (error) {
    res.status(500).json({ message: 'Error closing chat session', error });
  }
});

// Helper function to call OpenRouter API
async function callOpenRouterAPI(
  userMessage: string,
  messages: any[],
  currentSymptoms: string[]
): Promise<any> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    // Format messages for API
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add system prompt
    const systemPrompt = `You are a helpful medical assistant chatbot for a hospital management system. Your role is to:
1. Help patients understand their symptoms and possible conditions
2. Answer questions about prescribed medicines
3. Provide general health information
4. Suggest when to see a doctor

When analyzing symptoms, extract and list them clearly. Also provide possible diseases with confidence levels (0-100).
When answering medicine questions, provide clear information about usage, side effects, and precautions.

Current patient symptoms: ${currentSymptoms.join(', ') || 'None reported yet'}

Always be empathetic, clear, and remind patients to consult with a doctor for proper diagnosis.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Hospital Management System',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...formattedMessages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter API error: ${error.message}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    // Parse response to extract symptoms and diseases
    const symptoms = extractSymptoms(aiMessage);
    const possibleDiseases = extractDiseases(aiMessage);
    const medicineQuestions = extractMedicineQuestions(userMessage);

    return {
      response: aiMessage,
      symptoms,
      possibleDiseases,
      medicineQuestions,
    };
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return {
      response: 'I apologize, but I encountered an error. Please try again or consult with a doctor.',
      symptoms: [],
      possibleDiseases: [],
      medicineQuestions: [],
    };
  }
}

// Helper functions to extract information from responses
function extractSymptoms(text: string): string[] {
  const symptoms: string[] = [];
  const symptomKeywords = [
    'fever',
    'cough',
    'headache',
    'fatigue',
    'nausea',
    'vomiting',
    'diarrhea',
    'pain',
    'rash',
    'sore throat',
    'congestion',
    'shortness of breath',
  ];

  symptomKeywords.forEach((symptom) => {
    if (text.toLowerCase().includes(symptom)) {
      symptoms.push(symptom);
    }
  });

  return symptoms;
}

function extractDiseases(text: string): Array<{ disease: string; confidence: number; description: string }> {
  const diseases: Array<{ disease: string; confidence: number; description: string }> = [];
  const diseaseKeywords = [
    { name: 'Common Cold', keywords: ['cold', 'flu', 'viral'] },
    { name: 'Influenza', keywords: ['influenza', 'flu', 'seasonal'] },
    { name: 'COVID-19', keywords: ['covid', 'coronavirus'] },
    { name: 'Allergies', keywords: ['allergy', 'allergic', 'allergen'] },
    { name: 'Asthma', keywords: ['asthma', 'breathing', 'respiratory'] },
    { name: 'Gastroenteritis', keywords: ['gastro', 'stomach', 'digestive'] },
  ];

  diseaseKeywords.forEach((disease) => {
    const count = disease.keywords.filter((keyword) => text.toLowerCase().includes(keyword)).length;
    if (count > 0) {
      diseases.push({
        disease: disease.name,
        confidence: Math.min(count * 20, 100),
        description: `Possible based on reported symptoms`,
      });
    }
  });

  return diseases;
}

function extractMedicineQuestions(text: string): string[] {
  const medicineKeywords = ['medicine', 'drug', 'medication', 'tablet', 'capsule', 'injection', 'side effect', 'dosage'];
  const questions: string[] = [];

  if (medicineKeywords.some((keyword) => text.toLowerCase().includes(keyword))) {
    questions.push(text);
  }

  return questions;
}

export default router;

