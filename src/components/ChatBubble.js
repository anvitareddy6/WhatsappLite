import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { formatTime } from '../utils/helpers';

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const ChatBubble = ({ 
  message, 
  isOwn, 
  showAvatar, 
  senderName, 
  senderAvatar,
  activeReactionId,
  onToggleReaction,
  onReaction, // This prop is passed from ChatScreen
}) => {
  const showReactions = activeReactionId === message.id;

  // Get the user's current reaction for this message
  const userReaction = message.reactions?.user || null;

  const handleLongPress = () => {
    if (!isOwn) {
      onToggleReaction(message.id);
    }
  };

  const handleSelectReaction = (emoji) => {
    // Call the parent's onReaction handler to persist the reaction
    onReaction(message.id, emoji);
    onToggleReaction(null); // Close picker after selection
  };

  const handleOutsidePress = () => {
    if (showReactions) {
      onToggleReaction(null);
    }
  };

  return (
    <Pressable onPress={handleOutsidePress}>
      <View style={[styles.rowContainer, isOwn ? styles.rowOwn : styles.rowOther, (activeReactionId === message.id)&&showReactions?styles.rowContainerReactions:styles.rowContainerNoReactions]}>
        {!isOwn && showAvatar && (
          <Image source={{ uri: senderAvatar }} style={styles.avatar} />
        )}
        {!isOwn && !showAvatar && <View style={styles.avatarPlaceholder} />}

        <View style={styles.messageColumn}>
          {/* Message bubble */}
          <TouchableOpacity
            activeOpacity={0.8}
            onLongPress={handleLongPress}
            style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}
          >
            {!isOwn && senderName && (
              <Text style={styles.senderName}>{senderName}</Text>
            )}

            <Text style={[styles.messageText, isOwn ? styles.ownText : styles.otherText]}>
              {message.text}
            </Text>

            <View style={styles.metaContainer}>
              <Text style={[styles.time, isOwn ? styles.ownTime : styles.otherTime]}>
                {formatTime(message.timestamp)}
              </Text>
              {isOwn && (
                <View style={styles.checkContainer}>
                  <Text style={[styles.checkmark, styles.checkmark1]}>✓</Text>
                  <Text style={[styles.checkmark, styles.checkmark2]}>✓</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Reaction picker (inline, below message) */}
          {!isOwn && showReactions && (
            <View
              style={[
                styles.reactionPickerInline,
                isOwn ? styles.reactionPickerRight : styles.reactionPickerLeft,
              ]}
            >
              {REACTIONS.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => handleSelectReaction(emoji)}
                  style={[
                    styles.reactionOption,
                    userReaction === emoji && styles.selectedReaction,
                  ]}
                >
                  <Text style={styles.reactionEmojiPicker}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Selected reaction shown below - now reading from message.reactions */}
          {userReaction && (
            <View
              style={[
                styles.reactionContainer,
                isOwn ? styles.reactionOwn : styles.reactionOther,
              ]}
            >
              <Text style={styles.reactionEmoji}>{userReaction}</Text>
            </View>
          )}
        </View>

        {isOwn && <View style={styles.avatarPlaceholder} />}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    marginVertical: 3,
    marginHorizontal: 8,
    alignItems: 'flex-end',
  },
  rowOwn: {
    justifyContent: 'flex-end',
  },
  rowOther: {
    justifyContent: 'flex-start',
  },
  rowContainerReactions:{
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding:10,
  },
  rowContainerNoReactions:{
    // opacity:0.5,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 32,
    marginRight: 8,
  },
  messageColumn: {
    maxWidth: '75%',
    flexShrink: 1,
  },
  bubble: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  ownBubble: {
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 2,
    alignSelf: 'flex-end',
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 2,
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#075E54',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    paddingBottom: 2,
  },
  ownText: { color: '#000' },
  otherText: { color: '#000' },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 3,
  },
  time: {
    fontSize: 11,
    marginRight: 4,
  },
  ownTime: { color: '#667781' },
  otherTime: { color: '#8696a0' },
  checkContainer: {
    flexDirection: 'row',
    position: 'relative',
    width: 14,
    height: 10,
    marginLeft: 2,
  },
  checkmark: {
    fontSize: 11,
    color: '#53BDEB',
    fontWeight: '600',
    position: 'absolute',
    lineHeight: 10,
  },
  checkmark1: { left: 0 },
  checkmark2: { left: 3 },

  // Reaction below message
  reactionContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
    elevation: 2,
  },
  reactionOwn: { alignSelf: 'flex-end' },
  reactionOther: { alignSelf: 'flex-start' },
  reactionEmoji: {
    fontSize: 16,
  },

  // Inline Picker
  reactionPickerInline: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 6,
    elevation: 3,
    alignSelf: 'flex-start',
    opacity:1,
    zIndex:999,
  },
  reactionPickerLeft: {
    alignSelf: 'flex-start',
  },
  reactionPickerRight: {
    alignSelf: 'flex-end',
  },
  reactionOption: {
    marginHorizontal: 4,
  },
  selectedReaction: {
    backgroundColor: '#d2edf9ff',
    borderRadius: 16,
  },
  reactionEmojiPicker: {
    fontSize: 22,
    padding: 2,
  },
});

export default ChatBubble;