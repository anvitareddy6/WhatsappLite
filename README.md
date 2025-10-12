# Bakchod AI WhatsApp

A WhatsApp-style chat application where users can have conversations with AI characters powered by Google Gemini 1.5 Flash. Create one-on-one chats or dynamic group conversations that run automatically.

## Features

### Core Features
- **One-on-One Chats**: Private conversations with individual AI characters
- **Group Chats**: Create groups with multiple AI characters
- **Auto-Running Conversations**: Group chats continue automatically with AI characters responding to each other
- **WhatsApp-Style UI**: Familiar chat interface with bubbles, timestamps, and sender names
- **Persistent Storage**: All chats and messages saved locally using AsyncStorage

### UI Features
- Chat bubbles with read receipts
- Typing indicators with animated dots
- Profile pictures for all characters
- Online/offline status
- Smooth scrolling and keyboard handling
- Mobile-first responsive design
- Empty states and loading indicators

### AI Integration
- Direct Google Gemini 1.5 Flash API calls (no backend required)
- Context-aware responses based on conversation history
- Distinct personalities for each AI character
- Natural, casual conversation style
- Group chat dynamics with varied response patterns

## Tech Stack

- **Framework**: React Native 0.73
- **Navigation**: React Navigation 6
- **AI Model**: Google Gemini 1.5 Flash API
- **Storage**: AsyncStorage
- **Icons**: React Native Vector Icons
- **Language**: JavaScript

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ChatBubble.js
│   ├── ChatHeader.js
│   ├── ChatInput.js
│   ├── ContactCard.js
│   ├── GroupCard.js
│   └── TypingIndicator.js
├── screens/            # Main app screens
│   ├── ChatsListScreen.js
│   ├── ChatScreen.js
│   ├── CreateGroupScreen.js
│   └── SelectCharactersScreen.js
├── services/           # Business logic
│   ├── geminiService.js
│   └── storageService.js
├── utils/             # Helper functions
│   ├── characters.js
│   └── helpers.js
└── App.js             # Entry point
```

## Installation

### Prerequisites
- Node.js >= 18
- React Native development environment set up
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)

### Setup Steps

1. **Clone or create the project**
```bash
npx react-native@latest init BakchodAIWhatsApp
cd BakchodAIWhatsApp
```

2. **Install dependencies**
```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install react-native-vector-icons
npm install @google/generative-ai
npm install react-native-uuid
```

3. **Link vector icons** (Android)

Edit `android/app/build.gradle` and add at the bottom:
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

4. **Configure Android permissions**

Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

5. **Get Gemini API Key**
- Go to https://makersuite.google.com/app/apikey
- Create a new API key
- Open `src/services/geminiService.js`
- Replace `YOUR_GEMINI_API_KEY` with your actual API key

6. **Copy all source files**

Create the folder structure and copy all the provided source files into their respective directories.

## Running the App

### Start Metro Bundler
```bash
npm start
```

### Run on Android
```bash
npm run android
```

### Run on iOS (Mac only)
```bash
cd ios && pod install && cd ..
npm run ios
```

## Building APK

### Debug APK
```bash
cd android
./gradlew assembleDebug
```
APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (Signed)

1. Generate keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Edit `android/gradle.properties`:
```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your-password
MYAPP_RELEASE_KEY_PASSWORD=your-password
```

3. Edit `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
}
```

4. Build release APK:
```bash
cd android
./gradlew assembleRelease
```
APK location: `android/app/build/outputs/apk/release/app-release.apk`

## How to Use

### Starting a 1-on-1 Chat
1. Tap the chat button on the home screen
2. Select one AI character
3. Tap "Start Chat"
4. Begin conversation

### Creating a Group
1. Tap the chat button on the home screen
2. Select multiple AI characters
3. Tap "Create Group"
4. Enter group name and optional topic
5. Tap "Create Group"
6. Send a message or wait for AI characters to start chatting

### Group Chat Behavior
- AI characters will automatically respond to messages
- Each character has a unique personality
- Response timing is randomized for natural feel
- Characters decide whether to respond based on conversation flow
- Group conversations continue automatically once started

## AI Characters

The app includes 8 distinct AI characters:

1. **Rohan** - The funny guy, cricket and Bollywood fan
2. **Priya** - The planner, organized and caring
3. **Arjun** - Fitness enthusiast, adventurous
4. **Sneha** - Gossip queen, dramatic and social
5. **Vikram** - Philosophical overthinker
6. **Anjali** - Confident, fashion-forward
7. **Karan** - Broke but resourceful
8. **Ishita** - Pop culture expert, binge-watcher

Each character has:
- Unique personality traits
- Distinct conversation style
- Profile picture
- Custom status message

## Configuration

### Adjusting Response Times

Edit `src/utils/helpers.js`:
```javascript
export const getRandomDelay = (min = 2000, max = 5000) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
```

### Modifying Character Personalities

Edit `src/utils/characters.js` to add or modify character personalities.

### Changing Response Length

Edit `src/services/geminiService.js` in the `buildPrompt` method to adjust instruction for response length.

## API Usage

The app makes direct API calls to Google Gemini 1.5 Flash. No backend server required.

**Important**: Keep your API key secure. For production apps, consider implementing proper API key management.

### API Costs
- Gemini 1.5 Flash offers free tier with generous limits
- Monitor usage at https://makersuite.google.com/

## Troubleshooting

### App crashes on startup
- Ensure all dependencies are installed
- Clear cache: `npm start -- --reset-cache`
- Rebuild: `cd android && ./gradlew clean && cd ..`

### API not working
- Verify API key is correct
- Check internet connection
- Ensure INTERNET permission is set in AndroidManifest.xml

### Icons not showing
- Run `react-native link react-native-vector-icons`
- Rebuild the app

### Keyboard covers input
- KeyboardAvoidingView is implemented
- Check Platform.OS specific behavior

## Future Enhancements

Potential features to add:
- Image sharing
- Voice messages
- Message reactions
- Search functionality
- Message deletion
- User profile customization
- Push notifications
- Cloud backup
- More AI characters
- Custom character creation

## License

This project is for educational purposes. Ensure compliance with Google's Gemini API terms of service.

## Credits

- Built with React Native
- Powered by Google Gemini 1.5 Flash
- Icons from React Native Vector Icons
- Profile pictures from pravatar.cc

---

**Note**: This is a demonstration project. For production use, implement proper error handling, security measures, and API key management.