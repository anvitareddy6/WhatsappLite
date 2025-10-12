import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';

import { generateId } from '../utils/helpers';
import storageService from '../services/storageService';

const CreateGroupScreen = ({ navigation, route }) => {
  const { selectedCharacters } = route.params;
  const [groupName, setGroupName] = useState('');
  const [groupTopic, setGroupTopic] = useState('');

  const handleCreate = async () => {
    if (!groupName.trim()) {
      Alert.alert('Group Name Required', 'Please enter a name for the group');
      return;
    }

    const chatId = generateId();
    
    const newChat = {
      id: chatId,
      name: groupName.trim(),
      avatar: 'https://i.pravatar.cc/150?img=68',
      isGroup: true,
      participants: selectedCharacters,
      topic: groupTopic.trim() || 'General chat',
      lastMessage: null,
      unreadCount: 0,
    };

    const chats = await storageService.getChats();
    await storageService.saveChats([...chats, newChat]);
    
    // Reset navigation stack so back button goes to ChatsList
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'ChatsList' },
          { 
            name: 'Chat', 
            params: { chat: newChat } 
          },
        ],
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" translucent={false} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter group name"
            value={groupName}
            onChangeText={setGroupName}
            maxLength={50}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Group Topic (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g., Planning Goa trip, IPL banter"
            value={groupTopic}
            onChangeText={setGroupTopic}
            multiline
            maxLength={200}
          />
          <Text style={styles.hint}>
            Setting a topic helps AI characters have focused conversations
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Participants ({selectedCharacters.length})
          </Text>
          <View style={styles.participantsContainer}>
            {selectedCharacters.map((character) => (
              <View key={character.id} style={styles.participantCard}>
                <Image
                  source={{ uri: character.avatar }}
                  style={styles.participantAvatar}
                />
                <Text style={styles.participantName}>{character.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Create Group</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>
            AI characters will chat with each other automatically based on their personalities.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  participantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  participantCard: {
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 12,
  },
  participantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 4,
  },
  participantName: {
    fontSize: 12,
    color: '#666',
  },
  createButton: {
    backgroundColor: '#25D366',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 20,
  },
});

export default CreateGroupScreen;