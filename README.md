# Bakchod AI - WhatsApp-Style AI Chat App

A React Native chat application where you can have conversations with AI characters powered by Google Gemini. Create 1-on-1 chats or group conversations with multiple AI personalities that chat amongst themselves and respond to you naturally.

## 🚀 Quick Start

```bash
# Install dependencies
npm i

# Start the app (with cache cleared)
npx expo start -c
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator  
- `w` for web browser

## ✨ Features

### Core Features
- **1-on-1 AI Chats** - Have personal conversations with individual AI characters
- **AI Group Chats** - Create groups where AI characters chat with each other and respond to you
- **Auto-Start Conversations** - AI characters automatically start chatting (no need to message first)
- **Smart Context Awareness** - AI responds to the latest 2 messages for relevant conversations
- **Message Reactions** - Long-press messages to add emoji reactions (persisted across sessions)
- **Chat Persistence** - All messages and reactions saved locally using AsyncStorage
- **Duplicate Prevention** - Automatically redirects to existing chats instead of creating duplicates

### AI Characters (8 Personalities)
- **Rohan** - The funny guy, cricket & Bollywood fan
- **Priya** - The organized planner, foodie
- **Arjun** - Fitness enthusiast, adventure lover
- **Sneha** - Gossip queen, drama expert
- **Vikram** - The overthinker, philosopher
- **Anjali** - Confident fashionista
- **Karan** - The broke but resourceful friend
- **Ishita** - Pop culture nerd, binge-watcher

### UI/UX Features
- WhatsApp-inspired design with green theme
- Typing indicators with animated dots
- Double-checkmark read receipts
- Avatar grouping for consecutive messages
- Smooth keyboard handling (iOS/Android/Web)
- Chat deletion with confirmation
- Real-time message timestamps

## 🤖 AI Model

**Google Gemini 2.5 Flash** via `@google/generative-ai`

### Why Gemini 2.5 Flash?
- ⚡ Ultra-fast response times (1-3 seconds)
- 💰 Cost-effective for high-volume conversations
- 🎯 Excellent at maintaining character personalities
- 📝 Great at short, conversational responses

### Prompt Engineering
- **Group Chats**: Focuses on last 2-3 messages with visual markers (`>>>` `<<<`)
- **Context Window**: Last 5-8 messages for relevance
- **Character Consistency**: Personality traits embedded in every prompt
- **Response Length**: Optimized for 1-2 sentence replies in groups

## 📱 Platform Optimizations

### iOS
- `padding` behavior for KeyboardAvoidingView
- Native blur and shadow effects
- Smooth scroll animations
- Haptic feedback support ready

### Android  
- `height` behavior for KeyboardAvoidingView
- Platform-specific text padding for input alignment
- Optimized elevation for shadows
- Back button handling

### Web
- Custom outline removal for inputs
- Enter key to send (Shift+Enter for new line)
- Mouse hover states for buttons
- Responsive keyboard dismiss
- Browser-based AsyncStorage

## 🏗️ Architecture

```
src/
├── components/         # Reusable UI (ChatBubble, ChatInput, etc.)
├── screens/           # Main screens (ChatsList, ChatScreen, etc.)
├── services/          # Business logic
│   ├── geminiService.js    # AI integration
│   └── storageService.js   # AsyncStorage wrapper
├── utils/
│   ├── characters.js       # AI character definitions
│   └── helpers.js          # Utility functions
└── App.js             # Navigation setup
```

## 🔑 Environment Setup

Add your Google Gemini API key in `src/services/geminiService.js`:

```javascript
const API_KEY = 'YOUR_API_KEY_HERE'; // Get from https://aistudio.google.com
```

## 📦 Key Dependencies

```json
{
  "@google/generative-ai": "^0.2.1",
  "@react-native-async-storage/async-storage": "^1.19.3",
  "@react-navigation/native": "^6.1.7",
  "@react-navigation/native-stack": "^6.9.13",
  "expo": "~49.0.0",
  "react-native": "0.72.4"
}
```

## 🎨 Design Features

- **WhatsApp Theme**: Green header (#075E54), light green bubbles (#DCF8C6)
- **Typography**: System fonts, 15-16px for readability
- **Shadows**: Subtle elevation for depth (Android) and shadows (iOS)
- **Animations**: Typing dots, smooth scrolling, keyboard transitions
- **Accessibility**: Proper contrast ratios, readable fonts

## 🔧 Performance Optimizations

1. **Message Batching** - Only last 5-8 messages sent to AI
2. **Lazy Loading** - FlatList for efficient message rendering
3. **Debounced Scrolling** - Smooth scroll-to-bottom on new messages
4. **Async State Updates** - Non-blocking UI during AI responses
5. **Memoization Ready** - Component structure supports React.memo
6. **Smart Re-renders** - Reactions update without full re-render

## 🐛 Known Issues & Future Enhancements

- [ ] Add message editing and deletion
- [ ] Implement voice messages
- [ ] Add image sharing capabilities
- [ ] Group chat member management
- [ ] Custom character creation
- [ ] Export chat history
- [ ] Dark mode support

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

---

Made with ❤️ using React Native + Expo + Google Gemini