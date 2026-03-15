const crypto = require('crypto');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Business = require('../models/Business');
const aiService = require('./aiService');
const whatsappService = require('./whatsappService');
const telegramService = require('./telegramService');

class WebhookService {
  async processWebhook(channel, payload, businessId) {
    try {
      const business = await Business.findById(businessId);
      if (!business) {
        throw new Error('Business not found');
      }

      let messageData;
      
      // Parse message based on channel
      switch (channel) {
        case 'whatsapp':
          messageData = await whatsappService.handleWebhook(payload);
          break;
        case 'telegram':
          messageData = await telegramService.handleWebhook(payload);
          break;
        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }

      if (!messageData) {
        return { status: 'ignored' };
      }

      // Find or create conversation
      let conversation = await Conversation.findOne({
        businessId,
        channel,
        customerId: messageData.from || messageData.chatId
      });

      if (!conversation) {
        conversation = await Conversation.create({
          businessId,
          chatbotId: business.defaultChatbotId, // You'll need to set this
          customerId: messageData.from || messageData.chatId,
          channel,
          language: this.detectLanguage(messageData.text),
          metadata: {
            username: messageData.username,
            firstName: messageData.firstName,
            lastName: messageData.lastName
          }
        });
      }

      // Save customer message
      const customerMessage = await Message.create({
        conversationId: conversation._id,
        sender: 'customer',
        content: messageData.text,
        language: conversation.language
      });

      // Update conversation last message time
      conversation.lastMessageAt = new Date();
      await conversation.save();

      // Get AI response
      const intent = await aiService.detectIntent(messageData.text, businessId);
      const response = await aiService.generateResponse(
        messageData.text,
        business,
        intent.faq,
        conversation.language
      );

      // Save bot message
      const botMessage = await Message.create({
        conversationId: conversation._id,
        sender: 'bot',
        content: response,
        language: conversation.language,
        intent: intent.intent,
        confidence: intent.confidence,
        metadata: {
          faqMatched: intent.faq?._id,
          aiResponse: !intent.faq
        }
      });

      // Send response back through the appropriate channel
      await this.sendResponse(channel, messageData, response, business);

      return {
        status: 'processed',
        conversation: conversation._id,
        intent: intent.intent,
        response: response
      };
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }

  async sendResponse(channel, messageData, response, business) {
    try {
      switch (channel) {
        case 'whatsapp':
          await whatsappService.sendMessage(messageData.from, response, business);
          break;
        case 'telegram':
          await telegramService.sendMessage(messageData.chatId, response, business);
          break;
        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }
    } catch (error) {
      console.error('Send response error:', error);
      throw error;
    }
  }

  detectLanguage(text) {
    // Simple language detection
    const rwandanWords = ['muraho', 'mwiriwe', 'urakoze', 'yego', 'oya', 'ngwino', 'amakuru'];
    const words = text.toLowerCase().split(' ');
    
    const rwandanCount = words.filter(word => rwandanWords.includes(word)).length;
    
    return rwandanCount > 0 ? 'rw' : 'en';
  }

  verifySignature(channel, signature, payload, secret) {
    try {
      switch (channel) {
        case 'whatsapp':
          return this.verifyWhatsAppSignature(signature, payload, secret);
        case 'telegram':
          // Telegram uses a different verification method
          return true;
        default:
          return false;
      }
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  verifyWhatsAppSignature(signature, payload, secret) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  async handleDeliveryReport(channel, report, businessId) {
    try {
      // Handle message delivery status updates
      console.log(`Delivery report for ${channel}:`, report);
      
      // Update message status in database
      if (report.messageId) {
        await Message.findOneAndUpdate(
          { 'metadata.providerMessageId': report.messageId },
          { 'metadata.deliveryStatus': report.status }
        );
      }
    } catch (error) {
      console.error('Delivery report error:', error);
    }
  }
}

module.exports = new WebhookService();