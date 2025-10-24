const express = require('express');
const router = express.Router();
const { Patient } = require('../models/Patient');
const { ChatSession } = require('../models/ChatSession');
const openRouterService = require('../services/openRouterService');
const { authMiddleware } = require('../middleware/auth');

// Get or create chat session for patient
router.get('/session', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.userId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    let chatSession = await ChatSession.findOne({
      patientId: patient._id,
      status: 'active',
    });

    if (!chatSession) {
      chatSession = new ChatSession({
        patientId: patient._id,
        messages: [],
        symptoms: [],
        possibleDiseases: [],
        medicineQuestions: [],
        status: 'active',
      });
      await chatSession.save();
    }

    res.json(chatSession);
  } catch (error) {
    console.error('Error getting chat session:', error);
    res.status(500).json({ error: 'Failed to get chat session' });
  }
});

// Send message to chatbot
router.post('/message', authMiddleware, async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    console.log('🔵 Chatbot message received:', { message, sessionId });

    if (!message || !sessionId) {
      console.error('❌ Missing required fields:', { message: !!message, sessionId: !!sessionId });
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }

    const chatSession = await ChatSession.findById(sessionId);
    if (!chatSession) {
      console.error('❌ Chat session not found:', sessionId);
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Add user message to history
    chatSession.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Get AI response
    const conversationHistory = chatSession.messages
      .slice(-10)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    console.log('🤖 Calling OpenRouter API with', conversationHistory.length, 'messages in history');
    const aiResponse = await openRouterService.sendMessage(message, conversationHistory);

    if (!aiResponse.success) {
      console.error('❌ OpenRouter API error:', aiResponse.error);
      return res.status(500).json({ error: aiResponse.error || 'Failed to get AI response' });
    }

    console.log('✅ AI response received:', aiResponse.message.substring(0, 100) + '...');

    // Add AI response to history
    chatSession.messages.push({
      role: 'assistant',
      content: aiResponse.message,
      timestamp: new Date(),
    });

    // Extract symptoms if user mentions them
    if (message.toLowerCase().includes('symptom') || message.toLowerCase().includes('pain')) {
      chatSession.symptoms.push(message);
    }

    await chatSession.save();

    res.json({
      success: true,
      message: aiResponse.message,
      session: chatSession,
    });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message: ' + error.message });
  }
});

// Analyze symptoms for possible diseases
router.post('/analyze-symptoms', authMiddleware, async (req, res) => {
  try {
    const { symptoms, sessionId } = req.body;

    if (!symptoms || !sessionId) {
      return res.status(400).json({ error: 'Symptoms and sessionId are required' });
    }

    const chatSession = await ChatSession.findById(sessionId);
    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    const analysis = await openRouterService.analyzeSymptomsForDiseases(symptoms);

    if (analysis.success && analysis.diseases && Array.isArray(analysis.diseases)) {
      chatSession.possibleDiseases = analysis.diseases;
      await chatSession.save();
    }

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    res.status(500).json({ error: 'Failed to analyze symptoms' });
  }
});

// Get medicine information
router.post('/medicine-info', authMiddleware, async (req, res) => {
  try {
    const { medicineName, sessionId } = req.body;

    if (!medicineName || !sessionId) {
      return res.status(400).json({ error: 'Medicine name and sessionId are required' });
    }

    const chatSession = await ChatSession.findById(sessionId);
    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    const info = await openRouterService.getMedicineInfo(medicineName);

    if (info.success) {
      chatSession.medicineQuestions.push(medicineName);
      await chatSession.save();
    }

    res.json(info);
  } catch (error) {
    console.error('Error getting medicine info:', error);
    res.status(500).json({ error: 'Failed to get medicine information' });
  }
});

// Save symptoms to patient record
router.post('/save-symptoms', authMiddleware, async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({ error: 'Symptoms array is required' });
    }

    const patient = await Patient.findOne({ userId: req.userId });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Add symptoms to patient record
    const newSymptoms = symptoms.map((symptom) => ({
      symptom: typeof symptom === 'string' ? symptom : symptom.symptom,
      description: typeof symptom === 'object' ? symptom.description : '',
      recordedAt: new Date(),
    }));

    patient.symptoms = [...(patient.symptoms || []), ...newSymptoms];
    await patient.save();

    res.json({
      success: true,
      message: 'Symptoms saved successfully',
      symptoms: patient.symptoms,
    });
  } catch (error) {
    console.error('Error saving symptoms:', error);
    res.status(500).json({ error: 'Failed to save symptoms' });
  }
});

// Get patient symptoms (for doctor)
router.get('/patient-symptoms/:patientId', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({
      success: true,
      symptoms: patient.symptoms || [],
    });
  } catch (error) {
    console.error('Error getting patient symptoms:', error);
    res.status(500).json({ error: 'Failed to get patient symptoms' });
  }
});

// Analyze symptoms for possible diseases
router.post('/analyze-symptoms-detailed', authMiddleware, async (req, res) => {
  try {
    const { symptoms, sessionId } = req.body;

    console.log('🔍 Detailed symptom analysis requested:', { symptoms, sessionId });

    if (!symptoms) {
      return res.status(400).json({ error: 'Symptoms are required' });
    }

    // Call OpenRouter for detailed analysis
    const analysis = await openRouterService.analyzeSymptoms(symptoms);

    if (!analysis.success) {
      console.warn('⚠️ Using fallback symptom analysis');
    }

    // Save to chat session if provided
    if (sessionId) {
      const chatSession = await ChatSession.findById(sessionId);
      if (chatSession) {
        // Add analysis to messages
        chatSession.messages.push({
          role: 'assistant',
          content: analysis.analysis,
          timestamp: new Date(),
        });

        // Extract symptoms
        chatSession.symptoms.push(symptoms);

        await chatSession.save();
        console.log('✅ Analysis saved to chat session');
      }
    }

    res.json({
      success: true,
      analysis: analysis.analysis,
      usage: analysis.usage,
    });
  } catch (error) {
    console.error('❌ Error analyzing symptoms:', error);
    res.status(500).json({ error: 'Failed to analyze symptoms: ' + error.message });
  }
});

// Close chat session
router.post('/close-session', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'SessionId is required' });
    }

    const chatSession = await ChatSession.findByIdAndUpdate(
      sessionId,
      { status: 'closed' },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Chat session closed',
      session: chatSession,
    });
  } catch (error) {
    console.error('Error closing session:', error);
    res.status(500).json({ error: 'Failed to close session' });
  }
});

module.exports = router;

