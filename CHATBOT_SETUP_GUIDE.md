# 🤖 AI Health Assistant Chatbot - Setup & Usage Guide

## Overview

A comprehensive AI-powered health assistant chatbot has been integrated into the patient app. The chatbot helps patients:
- Describe and understand their symptoms
- Get information about prescribed medicines
- Ask general health questions
- Receive disease possibility suggestions
- Save symptoms for doctor review

---

## 🚀 Setup Instructions

### 1. Get OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Go to your API keys section
4. Copy your API key

### 2. Configure Environment Variables

Update `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=hospital_management_secret_key_2024_change_in_production
NODE_ENV=development
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Replace `your_openrouter_api_key_here` with your actual OpenRouter API key.

### 3. Install Dependencies

The required `axios` package has already been installed. If needed, run:

```bash
cd server
npm install axios
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Access the app at: `http://localhost:3000`

---

## 📱 Using the Chatbot

### Patient Side

1. **Login** to patient account
2. **Look for the floating chat button** in the bottom-right corner (blue with message icon)
3. **Click the button** to open the chat modal
4. **Choose a quick action** or type your question:
   - 🩺 **Symptoms** - Describe your symptoms
   - 💊 **Medicines** - Ask about prescribed medicines
   - 💡 **Advice** - Get general health advice

### Chat Features

- **Real-time responses** from AI health assistant
- **Symptom tracking** - Chat history is saved
- **Save for Doctor** - Button to save symptoms for doctor review
- **Attractive UI** - Modern gradient design with smooth animations

### Example Conversations

**Symptom Discussion:**
```
Patient: I have a headache and fever
Assistant: I understand you're experiencing a headache and fever. 
Can you tell me:
1. How long have you had these symptoms?
2. What's your temperature?
3. Any other symptoms like cough or body aches?
```

**Medicine Information:**
```
Patient: What are the side effects of Aspirin?
Assistant: Aspirin is commonly used for pain relief and fever reduction.
Common side effects include:
- Stomach upset or heartburn
- Nausea
- Increased bleeding risk
...
```

---

## 👨‍⚕️ Doctor Side

### Viewing Patient Symptoms

1. **Login** to doctor account
2. **Go to Patient Queue** or **Dashboard**
3. **Select a patient** to view details
4. **Scroll to "Symptoms from Health Assistant"** section
5. **Review all symptoms** the patient reported via chatbot

### Symptoms Display

The symptoms section shows:
- ✅ Symptom description
- 📅 Date recorded
- 📝 Additional details if provided
- 🔵 Blue highlight for easy identification

---

## 🔌 API Endpoints

### Chat Endpoints

**GET /api/chatbot/session**
- Get or create chat session for patient
- Returns: ChatSession object with message history

**POST /api/chatbot/message**
- Send message to chatbot
- Body: `{ message: string, sessionId: string }`
- Returns: AI response and updated session

**POST /api/chatbot/analyze-symptoms**
- Analyze symptoms for possible diseases
- Body: `{ symptoms: string, sessionId: string }`
- Returns: List of possible diseases with confidence levels

**POST /api/chatbot/medicine-info**
- Get information about a medicine
- Body: `{ medicineName: string, sessionId: string }`
- Returns: Medicine information

**POST /api/chatbot/save-symptoms**
- Save symptoms to patient record
- Body: `{ symptoms: string[] }`
- Returns: Confirmation and updated symptoms

**GET /api/chatbot/patient-symptoms/:patientId**
- Get patient symptoms (doctor access)
- Returns: Array of symptoms

**POST /api/chatbot/close-session**
- Close chat session
- Body: `{ sessionId: string }`
- Returns: Closed session

---

## 📊 Data Storage

### ChatSession Collection

```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Patient),
  messages: [
    {
      role: 'user' | 'assistant',
      content: String,
      timestamp: Date
    }
  ],
  symptoms: [String],
  possibleDiseases: [
    {
      disease: String,
      confidence: Number (0-100),
      description: String
    }
  ],
  medicineQuestions: [String],
  status: 'active' | 'closed',
  createdAt: Date,
  updatedAt: Date
}
```

### Patient Symptoms

```javascript
{
  symptoms: [
    {
      symptom: String,
      description: String,
      recordedAt: Date
    }
  ]
}
```

---

## 🎨 UI Components

### ChatbotFloatingButton
- Location: `client/components/patient/chatbot-floating-button.tsx`
- Features: Floating button with pulse animation
- Placement: Bottom-right corner of screen

### ChatbotModal
- Location: `client/components/patient/chatbot-modal.tsx`
- Features: Full chat interface with quick actions
- Responsive design for mobile and desktop

---

## ⚙️ Configuration

### OpenRouter Model

Current model: `meta-llama/llama-2-70b-chat`

To change model, edit `server/src/services/openRouterService.js`:

```javascript
this.model = 'meta-llama/llama-2-70b-chat'; // Change this
```

Available models: Check [OpenRouter Models](https://openrouter.ai/models)

### System Prompt

Edit the system prompt in `openRouterService.js` to customize chatbot behavior.

---

## 🧪 Testing

### Test Chatbot Functionality

1. **Login as patient**
2. **Click floating chat button**
3. **Send test message**: "I have a headache"
4. **Verify AI response** appears
5. **Click "Save Symptoms for Doctor"**
6. **Login as doctor**
7. **View patient details**
8. **Verify symptoms appear** in symptoms section

### Test API Endpoints

```bash
# Get chat session
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/chatbot/session

# Send message
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"I have a fever","sessionId":"SESSION_ID"}'
```

---

## 🐛 Troubleshooting

### Chatbot not responding

1. Check OpenRouter API key in `.env`
2. Verify internet connection
3. Check server logs for errors
4. Ensure MongoDB is running

### Symptoms not saving

1. Verify patient is logged in
2. Check browser console for errors
3. Ensure backend is running
4. Check MongoDB connection

### UI not showing

1. Clear browser cache
2. Restart frontend: `npm run dev`
3. Check for console errors
4. Verify components are imported correctly

---

## 📝 Files Created/Modified

### New Files
- ✅ `server/src/services/openRouterService.js` - OpenRouter API integration
- ✅ `server/src/routes/chatbot.js` - Chatbot API endpoints
- ✅ `server/src/models/ChatSession.js` - Chat session model
- ✅ `client/components/patient/chatbot-modal.tsx` - Chat UI
- ✅ `client/components/patient/chatbot-floating-button.tsx` - Floating button

### Modified Files
- ✅ `server/.env` - Added OPENROUTER_API_KEY
- ✅ `server/src/index.js` - Added chatbot routes
- ✅ `server/src/models/Patient.js` - Added symptoms field
- ✅ `client/app/patient/home/page.tsx` - Added chatbot button
- ✅ `client/app/doctor/patient/[id]/page.tsx` - Added symptoms display

---

## 🎯 Features Summary

✅ **Patient Features:**
- Floating chat button with pulse animation
- Real-time AI responses
- Quick action buttons (Symptoms, Medicines, Advice)
- Save symptoms for doctor
- Chat history persistence
- Attractive gradient UI

✅ **Doctor Features:**
- View patient symptoms from chatbot
- See symptom descriptions and dates
- Access during patient consultation
- Integrated in patient details page

✅ **Backend Features:**
- OpenRouter API integration
- Chat session management
- Symptom analysis
- Medicine information
- Secure authentication
- MongoDB persistence

---

## 🚀 Next Steps

1. Configure OpenRouter API key
2. Start backend and frontend
3. Test chatbot with patient account
4. Verify symptoms appear in doctor view
5. Customize system prompt as needed

---

**Status**: ✅ READY TO USE

For issues or questions, check the troubleshooting section or review the API documentation.

