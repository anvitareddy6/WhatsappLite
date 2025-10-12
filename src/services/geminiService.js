import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY='AIzaSyATzlKCjmMDJyBshaetgRLRR-9A1gDSgWc';//to be stored in env file
const genAI = new GoogleGenerativeAI(API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    this.conversationHistories = {};
  }

  buildPrompt(character, recentMessages, isGroup, groupContext = '', hasUserInput = false) {
    let prompt = `You are ${character.name}. ${character.personality}\n\n`;
    
    if (isGroup) {
      prompt += `This is a casual friends group chat.\n`;
      prompt += `${groupContext}\n\n`;
      
      if (hasUserInput) {
        prompt += `CRITICAL: Look at the MOST RECENT messages in the conversation below. If the user (real person) just spoke, respond directly to their LATEST message. Always focus on what was said most recently, not older messages.\n\n`;
      } else {
        prompt += `Continue the group discussion naturally based on the topic. Be spontaneous and engaging.\n\n`;
      }
      
      prompt += `RULES:\n`;
      prompt += `- Keep responses 1-2 sentences max\n`;
      prompt += `- Focus on the LATEST messages in the conversation\n`;
      prompt += `- React to what was JUST said (most recent 2-3 messages)\n`;
      prompt += `- Show your personality as ${character.name}\n`;
      prompt += `- Use casual, natural language\n`;
      prompt += `- Avoid excessive emojis\n\n`;
    } else {
      prompt += `You're chatting one-on-one. Be friendly and engaging.\n`;
      prompt += `Keep responses conversational and natural, 2-3 sentences usually.\n\n`;
    }

    prompt += `Recent conversation (oldest to newest):\n`;
    recentMessages.forEach((msg, index) => {
      const prefix = msg.isUser ? '👤 ' : '';
      const isRecent = index >= recentMessages.length - 3 ? ' ← RECENT' : '';
      prompt += `${prefix}${msg.senderName}: ${msg.text}${isRecent}\n`;
    });

    if (isGroup) {
      prompt += `\n PAY ATTENTION TO THE MESSAGES MARKED "RECENT" ABOVE.\n`;
      if (hasUserInput) {
        prompt += `The user  is a real person. If they spoke recently, you MUST respond to their latest message.\n`;
      }
      prompt += `\nRespond as ${character.name} naturally:`;
    } else {
      prompt += `\nRespond as ${character.name}:`;
    }

    return prompt;
  }

  async generateResponse(character, recentMessages, isGroup = false, groupContext = '', hasUserInput = false) {
    try {
      const prompt = this.buildPrompt(character, recentMessages, isGroup, groupContext, hasUserInput);

      console.log('=== FULL PROMPT SENT TO GEMINI ===\n', prompt);

      
      console.log('=== GENERATING RESPONSE ===');
      console.log('Character:', character.name);
      console.log('Has User Input:', hasUserInput);
      if (isGroup && recentMessages.length > 0) {
        const lastMsg = recentMessages[recentMessages.length - 1];
        console.log('Last message:', lastMsg.senderName, '-', lastMsg.text);
      }
      console.log('========================');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      text = text.replace(/^["\n\s]+|["\n\s]+$/g, '');
      text = text.replace(/\*\*/g, '');
      
      if (text.startsWith(`${character.name}:`)) {
        text = text.substring(character.name.length + 1).trim();
      }
      
      console.log('Generated response:', text);
      
      return text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getFallbackResponse(character, isGroup);
    }
  }

  getFallbackResponse(character, isGroup) {
    const fallbacks = isGroup ? [
      'Haha yeah',
      'True that',
      'Wait what',
      'Okay okay',
      'Fair point',
      'Lol',
      'Makes sense'
    ] : [
      'Hey, how have you been?',
      'Tell me more about that',
      'That sounds interesting',
      'What do you think?',
      'I see what you mean'
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  clearHistory(chatId) {
    delete this.conversationHistories[chatId];
  }
}

export default new GeminiService();