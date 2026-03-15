const axios = require('axios');

class TelegramService {
  constructor() {
    this.apiUrl = 'https://api.telegram.org/bot';
  }

  async sendMessage(chatId, message, business) {
    try {
      const { telegram } = business.integrations;
      if (!telegram || !telegram.enabled || !telegram.botToken) {
        throw new Error('Telegram integration not configured');
      }

      const response = await axios.post(
        `${this.apiUrl}${telegram.botToken}/sendMessage`,
        {
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        }
      );

      return response.data;
    } catch (error) {
      console.error('Telegram send error:', error);
      throw error;
    }
  }

  async sendPhoto(chatId, photoUrl, caption, business) {
    try {
      const { telegram } = business.integrations;
      
      const response = await axios.post(
        `${this.apiUrl}${telegram.botToken}/sendPhoto`,
        {
          chat_id: chatId,
          photo: photoUrl,
          caption: caption,
          parse_mode: 'HTML'
        }
      );

      return response.data;
    } catch (error) {
      console.error('Telegram send photo error:', error);
      throw error;
    }
  }

  async sendAction(chatId, action, business) {
    try {
      const { telegram } = business.integrations;
      
      const response = await axios.post(
        `${this.apiUrl}${telegram.botToken}/sendChatAction`,
        {
          chat_id: chatId,
          action: action // typing, upload_photo, etc.
        }
      );

      return response.data;
    } catch (error) {
      console.error('Telegram send action error:', error);
    }
  }

  async setWebhook(botToken, webhookUrl) {
    try {
      const response = await axios.post(
        `${this.apiUrl}${botToken}/setWebhook`,
        {
          url: webhookUrl
        }
      );
      return response.data;
    } catch (error) {
      console.error('Telegram set webhook error:', error);
      throw error;
    }
  }

  async handleWebhook(payload) {
    try {
      if (payload.message) {
        const message = payload.message;
        const chatId = message.chat.id;
        const text = message.text || '';
        const from = message.from;
        
        return {
          chatId,
          from: from.id,
          username: from.username,
          firstName: from.first_name,
          lastName: from.last_name,
          text,
          timestamp: message.date,
          type: 'telegram'
        };
      }
      return null;
    } catch (error) {
      console.error('Telegram webhook error:', error);
      throw error;
    }
  }

  async getChat(chatId, business) {
    try {
      const { telegram } = business.integrations;
      
      const response = await axios.get(
        `${this.apiUrl}${telegram.botToken}/getChat`,
        {
          params: { chat_id: chatId }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Telegram get chat error:', error);
      throw error;
    }
  }

  async deleteWebhook(botToken) {
    try {
      const response = await axios.post(
        `${this.apiUrl}${botToken}/deleteWebhook`
      );
      return response.data;
    } catch (error) {
      console.error('Telegram delete webhook error:', error);
      throw error;
    }
  }
}

module.exports = new TelegramService();