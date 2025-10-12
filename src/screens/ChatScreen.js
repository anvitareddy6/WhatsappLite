import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ChatHeader from '../components/ChatHeader';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import geminiService from '../services/geminiService';
import storageService from '../services/storageService';
import { generateId, getRandomDelay, shouldCharacterRespond } from '../utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen = ({ navigation, route }) => {
  const { chat } = route.params;
  const [messages, setMessages] = useState([]);
  const [typingCharacter, setTypingCharacter] = useState(null);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const flatListRef = useRef(null);
  const autoRunTimeoutRef = useRef(null);
  const messageCountRef = useRef(0);
    const [activeReactionId, setActiveReactionId] = useState(null);

  const handleToggleReaction = (messageId) => {
    setActiveReactionId(activeReactionId === messageId ? null : messageId);
  };
const messagesRef = useRef([]);
useEffect(() => { messagesRef.current = messages; }, [messages]);


  useEffect(() => {
    loadMessages();
    
    return () => {
      if (autoRunTimeoutRef.current) {
        clearTimeout(autoRunTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      saveChatAndMessages();
    }
  }, [messages]);

  const loadMessages = async () => {
  const savedMessages = await storageService.getMessages(chat.id);
  setMessages(savedMessages);

  if (chat.isGroup) {
    if (savedMessages.length > 0) {
      messageCountRef.current = savedMessages.length;
      scheduleNextGroupMessage(savedMessages);
    } else {
      console.log('🟢 New group detected. Starting first conversation...');
      setTimeout(() => {
        scheduleNextGroupMessage([]);
      }, 2000); // optional 2s delay for realism
    }
  }
};


  const saveChatAndMessages = async () => {
    await storageService.saveMessages(chat.id, messages);
    
    const lastMessage = messages[messages.length - 1];
    const updatedChat = {
      ...chat,
      lastMessage: lastMessage,
    };
    
    const chats = await storageService.getChats();
    const chatIndex = chats.findIndex((c) => c.id === chat.id);
    
    if (chatIndex !== -1) {
      chats[chatIndex] = updatedChat;
      await storageService.saveChats(chats);
    }
  };

  const handleDeleteChat = () => {
    console.log('handleDeleteChat called');
    console.log('Platform:', Platform.OS);
    console.log('About to show Alert...');
    
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        `Are you sure you want to delete this ${chat.isGroup ? 'group' : 'chat'}? All messages will be permanently deleted.`
      );
      
      if (confirmed) {
        performDelete();
      } else {
        console.log('Delete cancelled');
      }
    } else {
      try {
        Alert.alert(
          'Delete Chat',
          `Are you sure you want to delete this ${chat.isGroup ? 'group' : 'chat'}? All messages will be permanently deleted.`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => console.log('Delete cancelled'),
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: performDelete,
            },
          ],
          { cancelable: true }
        );
        console.log('Alert.alert called successfully');
      } catch (error) {
        console.error('Error showing alert:', error);
      }
    }
  };
  const handleReaction = (messageId, emoji) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          const userId = 'user';
          
          if (reactions[userId] === emoji) {
            delete reactions[userId];
          } else {
            reactions[userId] = emoji;
          }
          
          return { ...msg, reactions };
        }
        return msg;
      })
    );
  };

  const performDelete = async () => {
    try {
      console.log('Delete confirmed. Chat ID:', chat.id);
      console.log('Stopping auto-run...');
      if (autoRunTimeoutRef.current) {
        clearTimeout(autoRunTimeoutRef.current);
      }
      console.log('Calling deleteChat...');
      await storageService.deleteChat(chat.id);
      console.log('Chat deleted successfully. Navigating back...');
      navigation.navigate('ChatsList');
    } catch (error) {
      console.error('Error deleting chat:', error);
      if (Platform.OS === 'web') {
        window.alert('Failed to delete chat. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to delete chat. Please try again.');
      }
    }
  };

const addMessage = (text, senderId, senderName, senderAvatar) => {
  const newMessage = {
    id: generateId(),
    text,
    senderId,
    senderName,
    senderAvatar,
    timestamp: Date.now(),
    isUser: senderId === 'user',
  };

  // update ref immediately (so updatedMessages can be built synchronously)
  messagesRef.current = [...messagesRef.current, newMessage];

  // update state (still async)
  setMessages(prev => [...prev, newMessage]);
  messageCountRef.current += 1;

  setTimeout(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, 100);

  return newMessage;
};


const handleSendMessage = async (text) => {
  // create + add message (updates messagesRef immediately)
  const newMsg = addMessage(text, 'user', 'You', null);

  // build a snapshot of messages that definitely contains newMsg
  const updatedMessages = [...messagesRef.current];

  if (chat.isGroup) {
    // for group chats: schedule the next group message and pass the latest messages
    scheduleNextGroupMessage(updatedMessages);
  } else {
    // for 1:1 chats: pass the chat.character (must be the FIRST arg) and updated messages
    handleSingleChatResponse(chat.character, updatedMessages);
  }
};




const handleSingleChatResponse = async (character, updatedMessages) => {
  if (!character || !character.name) {
    console.error('handleSingleChatResponse: missing character:', character);
    return;
  }

  setTypingCharacter({ name: character.name, avatar: character.avatar });

  // prepare the recentMessages payload for Gemini
  const recentMessages = updatedMessages.slice(-10).map(m => ({
    text: m.text,
    senderName: m.senderName,
    isUser: m.senderId === 'user',
  }));

  console.log('🧠 handleSingleChatResponse -> recentMessages:', recentMessages);

  const delay = getRandomDelay(1500, 3000);
  setTimeout(async () => {
    const response = await geminiService.generateResponse(
      character,
      recentMessages,
      false,
      '',
      true
    );

    setTypingCharacter(null);
    addMessage(response, character.id ?? 'ai', character.name, character.avatar);
  }, delay);
};




const scheduleNextGroupMessage = (providedMessages) => {
  if (autoRunTimeoutRef.current) {
    clearTimeout(autoRunTimeoutRef.current);
  }
  setIsAutoRunning(true);

  const delay = getRandomDelay(3000, 7000);
  autoRunTimeoutRef.current = setTimeout(() => {
    generateGroupMessage(providedMessages || messagesRef.current);
  }, delay);
};

const generateGroupMessage = async (currentMessages) => {
  currentMessages = currentMessages || messagesRef.current;

  const availableCharacters = chat.participants.filter(
    (char) => shouldCharacterRespond(messageCountRef.current, chat.participants.length)
  );

  if (availableCharacters.length === 0) {
    scheduleNextGroupMessage(currentMessages);
    return;
  }

  const randomCharacter = availableCharacters[
    Math.floor(Math.random() * availableCharacters.length)
  ];

  setTypingCharacter({ name: randomCharacter.name, avatar: randomCharacter.avatar });

  const recentMessages = currentMessages.slice(-15).map(msg => ({
    text: msg.text,
    senderName: msg.senderName,
    isUser: msg.senderId === 'user',
  }));

  const allUserMessages = currentMessages.filter(msg => msg.senderId === 'user');

  let contextualTopic = chat.topic || 'casual conversation';
  let hasUserInput = false;

  if (allUserMessages.length > 0) {
    hasUserInput = true;
    const lastUserMessage = allUserMessages[allUserMessages.length - 1];
    const lastUserIndex = currentMessages.findIndex(msg => msg.id === lastUserMessage.id);
    const messagesSinceLastUser = currentMessages.length - lastUserIndex - 1;

    if (messagesSinceLastUser <= 3) {
      const userContext = lastUserMessage.text;
      contextualTopic = `Topic: ${chat.topic || 'general chat'}. User's most recent message: "${userContext}". Respond to what the user JUST said while staying natural.`;
      console.log('Recent user message detected:', userContext);
    } else {
      const recentUserMessages = allUserMessages.slice(-2);
      const userContext = recentUserMessages.map(msg => msg.text).join('. ');
      contextualTopic = `Topic: ${chat.topic || 'general chat'}. User previously mentioned: "${userContext}". Keep this in mind but follow the natural flow of conversation.`;
      console.log('Earlier user messages:', userContext);
    }
  } else {
    contextualTopic = `The group topic is: ${chat.topic || 'general chat'}. Discuss this topic naturally with the group.`;
    console.log('No user input. Using topic:', contextualTopic);
  }

  const typingDelay = getRandomDelay(2000, 4000);

  setTimeout(async () => {
    console.log('🧠 generateGroupMessage -> randomCharacter:', randomCharacter.name, 'recentMessages:', recentMessages);
    const response = await geminiService.generateResponse(
      randomCharacter,
      recentMessages,
      true,
      contextualTopic,
      hasUserInput
    );

    setTypingCharacter(null);
    addMessage(response, randomCharacter.id, randomCharacter.name, randomCharacter.avatar);
    scheduleNextGroupMessage(); // keep auto-run going
  }, typingDelay);
};


  const renderMessage = ({ item, index }) => {
    const isOwn = item.senderId === 'user';
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = !prevMessage || prevMessage.senderId !== item.senderId;

    return (
      <ChatBubble
        message={item}
        isOwn={isOwn}
        showAvatar={showAvatar}
        senderName={!isOwn && chat.isGroup ? item.senderName : null}
        senderAvatar={item.senderAvatar}
          onReaction={handleReaction}
          activeReactionId={activeReactionId}
            onToggleReaction={handleToggleReaction}
      />
    );
  };

  return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>

    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ChatHeader
        chat={chat}
        onBack={() => {
          if (autoRunTimeoutRef.current) {
            clearTimeout(autoRunTimeoutRef.current);
          }
          navigation.navigate('ChatsList');
        }}
        onDelete={handleDeleteChat}
        isOnline={!chat.isGroup}
      />
      
      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
          onLayout={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
        />
        
        {typingCharacter && (
          <TypingIndicator
            characterName={chat.isGroup ? typingCharacter.name : null}
            characterAvatar={typingCharacter.avatar}
          />
        )}
      </View>
      
      <ChatInput onSend={handleSendMessage} disabled={false} />
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#075E54',
  },
  container: {
    flex: 1,
    backgroundColor: '#ECE5DD',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: 8,
  },
});

export default ChatScreen;