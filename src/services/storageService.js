import AsyncStorage from '@react-native-async-storage/async-storage';

const CHATS_KEY = '@chats';
const MESSAGES_KEY = '@messages_';

class StorageService {
  async saveChats(chats) {
    try {
      await AsyncStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats:', error);
    }
  }

  async getChats() {
    try {
      const chatsJson = await AsyncStorage.getItem(CHATS_KEY);
      return chatsJson ? JSON.parse(chatsJson) : [];
    } catch (error) {
      console.error('Error loading chats:', error);
      return [];
    }
  }

  async saveMessages(chatId, messages) {
    try {
      await AsyncStorage.setItem(
        `${MESSAGES_KEY}${chatId}`,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }

  async getMessages(chatId) {
    try {
      const messagesJson = await AsyncStorage.getItem(`${MESSAGES_KEY}${chatId}`);
      return messagesJson ? JSON.parse(messagesJson) : [];
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  }

  async deleteChat(chatId) {
    try {
      console.log('StorageService: Deleting chat:', chatId);
      
      await AsyncStorage.removeItem(`${MESSAGES_KEY}${chatId}`);
      console.log('StorageService: Messages deleted');
      
      const chats = await this.getChats();
      console.log('StorageService: Current chats:', chats.length);
      
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      console.log('StorageService: Updated chats:', updatedChats.length);
      
      await this.saveChats(updatedChats);
      console.log('StorageService: Chats saved successfully');
      
      return true;
    } catch (error) {
      console.error('StorageService: Error deleting chat:', error);
      throw error;
    }
  }

  async clearAll() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export default new StorageService();