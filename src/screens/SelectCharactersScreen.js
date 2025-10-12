import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import GroupCard from '../components/GroupCard';
import { AI_CHARACTERS } from '../utils/characters';
import { generateId } from '../utils/helpers';
import storageService from '../services/storageService';

const SelectCharactersScreen = ({ navigation }) => {
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleCharacter = (character) => {
    setSelectedCharacters((prev) => {
      const exists = prev.find((c) => c.id === character.id);
      if (exists) {
        return prev.filter((c) => c.id !== character.id);
      } else {
        return [...prev, character];
      }
    });
  };

  const handleNext = async () => {
    if (selectedCharacters.length === 0) {
      Alert.alert('Select Characters', 'Please select at least one character');
      return;
    }

    if (isLoading) return;
    
    setIsLoading(true);

    try {
      if (selectedCharacters.length === 1) {
        const character = selectedCharacters[0];
        const chats = await storageService.getChats();
        
        // Check if a 1-on-1 chat already exists with this character
        const existingChat = chats.find(
          (chat) => !chat.isGroup && chat.character?.id === character.id
        );

        if (existingChat) {
          // Navigate to existing chat
          console.log('Found existing chat with:', character.name);
          setIsLoading(false);
          
          setTimeout(() => {
            navigation.navigate('Chat', { chat: existingChat });
          }, 100);
        } else {
          // Create new chat
          const chatId = generateId();
          
          const newChat = {
            id: chatId,
            name: character.name,
            avatar: character.avatar,
            isGroup: false,
            character: character,
            lastMessage: null,
            unreadCount: 0,
          };

          await storageService.saveChats([...chats, newChat]);
          
          console.log('Creating new chat with:', newChat.name);
          
          setIsLoading(false);
          
          setTimeout(() => {
            navigation.navigate('Chat', { chat: newChat, isNewChat: true });
          }, 100);
        }
      } else {
        setIsLoading(false);
        navigation.navigate('CreateGroup', {
          selectedCharacters,
        });
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to create chat. Please try again.');
    }
  };

  const renderCharacter = ({ item }) => (
    <GroupCard
      character={item}
      isSelected={selectedCharacters.some((c) => c.id === item.id)}
      onToggle={() => toggleCharacter(item)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Select {selectedCharacters.length > 0 ? `${selectedCharacters.length} ` : ''}
          character{selectedCharacters.length !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.subheaderText}>
          Choose one for 1-on-1 chat or multiple for a group
        </Text>
      </View>

      <FlatList
        data={AI_CHARACTERS}
        renderItem={renderCharacter}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      {selectedCharacters.length > 0 && (
        <TouchableOpacity 
          style={[styles.nextButton, isLoading && styles.nextButtonDisabled]} 
          onPress={handleNext}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {isLoading ? 'Loading...' : (selectedCharacters.length === 1 ? 'Start Chat' : 'Create Group')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  subheaderText: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#25D366',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SelectCharactersScreen;