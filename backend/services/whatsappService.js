const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.apiUrl = 'https://graph.facebook.com/v17.0';
  }

  async sendMessage(phoneNumber, message, business) {
    try {
      const { whatsapp } = business.integrations;
      if (!whatsapp || !whatsapp.enabled || !whatsapp.apiKey) {
        throw new Error('WhatsApp integration not configured');
      }

      const response = await axios.post(
        `${this.apiUrl}/${whatsapp.phoneNumber}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${whatsapp.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('WhatsApp send error:', error);
      throw error;
    }
  }

  async sendTemplate(phoneNumber, templateName, language, components, business) {
    try {
      const { whatsapp } = business.integrations;
      
      const response = await axios.post(
        `${this.apiUrl}/${whatsapp.phoneNumber}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'template',
          template: {
            name: templateName,
            language: { code: language },
            components: components
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${whatsapp.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('WhatsApp template send error:', error);
      throw error;
    }
  }

  async handleWebhook(payload) {
    try {
      // Process incoming WhatsApp messages
      if (payload.entry && payload.entry[0].changes) {
        const change = payload.entry[0].changes[0];
        if (change.value.messages) {
          const message = change.value.messages[0];
          const from = message.from;
          const text = message.text?.body || '';
          
          return {
            from,
            text,
            timestamp: message.timestamp,
            type: 'whatsapp'
          };
        }
      }
      return null;
    } catch (error) {
      console.error('WhatsApp webhook error:', error);
      throw error;
    }
  }

  async verifyWebhook(token) {
    // Verify webhook token for WhatsApp
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
    return token === VERIFY_TOKEN;
  }

  async markAsRead(messageId, business) {
    try {
      const { whatsapp } = business.integrations;
      
      await axios.post(
        `${this.apiUrl}/${whatsapp.phoneNumber}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId
        },
        {
          headers: {
            'Authorization': `Bearer ${whatsapp.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('WhatsApp mark as read error:', error);
    }
  }

  async getMedia(mediaId, business) {
    try {
      const { whatsapp } = business.integrations;
      
      const response = await axios.get(
        `${this.apiUrl}/${mediaId}`,
        {
          headers: {
            'Authorization': `Bearer ${whatsapp.apiKey}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('WhatsApp get media error:', error);
      throw error;
    }
  }
}

module.exports = new WhatsAppService();