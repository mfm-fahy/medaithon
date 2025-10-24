# 🚀 AI Health Assistant Chatbot - Quick Start (5 Minutes)

## Step 1: Get OpenRouter API Key (2 min)

1. Go to https://openrouter.ai
2. Sign up (free account)
3. Copy your API key from dashboard

## Step 2: Configure API Key (1 min)

Edit `server/.env`:

```
OPENROUTER_API_KEY=paste_your_key_here
```

## Step 3: Start Application (2 min)

**Terminal 1:**

```bash
cd server
npm run dev
```

**Terminal 2:**

```bash
cd client
npm run dev
```

## Step 4: Test It!

1. Go to http://localhost:3000
2. Login as patient
3. Click blue chat button (bottom-right)
4. Type: "I have a headache and fever"
5. Get AI response
6. Click "Save Symptoms for Doctor"

## Step 5: View as Doctor

1. Login as doctor
2. Go to patient details
3. Scroll down to "Symptoms from Health Assistant"
4. See saved symptoms!

---

## 🎯 What You Get

✅ **Floating Chat Button** - Bottom-right corner with pulse animation
✅ **AI Responses** - Real-time answers from Llama 2 AI
✅ **Quick Actions** - Symptoms, Medicines, Advice buttons
✅ **Save for Doctor** - Symptoms stored in patient record
✅ **Doctor View** - See all symptoms in patient details
✅ **Beautiful UI** - Gradient design, smooth animations

---

## 📱 Patient Features

- 💬 Chat with AI health assistant
- 🩺 Describe symptoms
- 💊 Ask about medicines
- 💡 Get health advice
- 💾 Save symptoms for doctor
- 📱 Mobile responsive

---

## 👨‍⚕️ Doctor Features

- 👀 View patient symptoms
- 📅 See when symptoms were reported
- 📝 Read symptom descriptions
- 🔵 Easy to identify (blue highlight)

---

## 🔧 Troubleshooting

**Chatbot not responding?**

- Check API key in `.env`
- Restart backend: `npm run dev`
- Check internet connection

**Symptoms not saving?**

- Verify you're logged in
- Check browser console for errors
- Restart frontend

**Button not showing?**

- Clear browser cache
- Restart frontend
- Check console for errors

---

## 📚 Full Documentation

- **Setup Guide**: `CHATBOT_SETUP_GUIDE.md`
- **Implementation**: `CHATBOT_IMPLEMENTATION_SUMMARY.md`
- **API Docs**: See CHATBOT_SETUP_GUIDE.md

---

## ✨ Features Included

### Backend

- ✅ OpenRouter API integration
- ✅ Chat session management
- ✅ Symptom analysis
- ✅ Medicine information
- ✅ Secure authentication
- ✅ MongoDB persistence

### Frontend

- ✅ Floating chat button
- ✅ Chat modal with history
- ✅ Quick action buttons
- ✅ Save symptoms button
- ✅ Responsive design
- ✅ Error handling

### Doctor Integration

- ✅ Symptoms display
- ✅ Date tracking
- ✅ Description viewing
- ✅ Patient details page

---

## 🎨 UI Preview

```
┌─────────────────────────────────┐
│ Health Assistant                │ ← Header (Blue Gradient)
├─────────────────────────────────┤
│ Welcome to Health Assistant     │
│ Ask me about symptoms...        │
│                                 │
│ [User Message]                  │
│ [Assistant Response]            │
│                                 │
├─────────────────────────────────┤
│ [Symptoms] [Medicines] [Advice] │ ← Quick Actions
├─────────────────────────────────┤
│ [Type message...] [Send]        │
│ [Save Symptoms for Doctor]      │
└─────────────────────────────────┘

        ↓ (Bottom Right)
    ┌─────────┐
    │ 💬      │ ← Floating Button
    └─────────┘
```

---

## 📊 Data Saved

**In ChatSession:**

- Chat messages (user & AI)
- Symptoms mentioned
- Possible diseases
- Medicine questions

**In Patient Record:**

- Symptoms array
- Symptom descriptions
- Recording dates

---

## 🔐 Security

✅ JWT authentication
✅ Patient privacy
✅ Doctor authorization
✅ Secure API key storage
✅ CORS protection

---

## 🎯 Next Steps

1. ✅ Get OpenRouter API key
2. ✅ Add to `.env`
3. ✅ Start backend & frontend
4. ✅ Test as patient
5. ✅ Test as doctor
6. ✅ Customize if needed

---

**Ready to go!** 🚀

Follow the 5 steps above and you're done!
