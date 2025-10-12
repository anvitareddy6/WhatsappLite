import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ChatHeader = ({ chat, onBack, onDelete, isOnline = true }) => {
  return (
    <>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      <View style={styles.container}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Image
          source={{ uri: chat.avatar }}
          style={styles.avatar}
        />
        
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {chat.name}
          </Text>
          {chat.isGroup ? (
            <Text style={styles.status} numberOfLines={1}>
              {chat.participants?.map(p => p.name).join(', ')}
            </Text>
          ) : (
            <Text style={styles.status}>
              {isOnline ? 'online' : 'offline'}
            </Text>
          )}
        </View>
        
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="videocam" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="call" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => {
            console.log('Delete icon pressed');
            if (onDelete) {
              onDelete();
            } else {
              console.log('onDelete is not defined');
            }
          }}
        >
          <MaterialIcons name="delete" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E54',
    paddingVertical: 10,
    paddingHorizontal: 8,
    elevation: 4,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  status: {
    fontSize: 13,
    color: '#E0E0E0',
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default ChatHeader;