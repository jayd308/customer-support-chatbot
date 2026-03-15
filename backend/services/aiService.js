const OpenAI = require('openai');
const FAQ = require('../models/FAQ');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async detectIntent(message, businessId) {
    try {
      const faqs = await FAQ.find({ businessId, isActive: true });
      
      // Simple keyword matching first
      const words = message.toLowerCase().split(' ');
      for (const faq of faqs) {
        const match = faq.keywords.some(keyword => 
          words.includes(keyword.toLowerCase())
        );
        if (match) {
          return {
            intent: 'faq',
            confidence: 0.8,
            faq: faq
          };
        }
      }

      // Use AI for complex intent detection
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a customer support AI. Detect the intent of the user message. Respond with one of: greeting, question, complaint, purchase, support, other"
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 10,
        temperature: 0.3
      });

      return {
        intent: completion.choices[0].message.content.trim().toLowerCase(),
        confidence: 0.7,
        faq: null
      };
    } catch (error) {
      console.error('Intent detection error:', error);
      return {
        intent: 'other',
        confidence: 0.5,
        faq: null
      };
    }
  }

  async generateResponse(message, business, faq = null, language = 'en') {
    try {
      if (faq) {
        return language === 'rw' ? faq.answer.rw : faq.answer.en;
      }

      const systemPrompt = language === 'rw' 
        ? `Uri umukozi wa customer support wa ${business.name}. Subiza neza mu Kinyarwanda.`
        : `You are a customer support AI for ${business.name}. Be helpful and professional.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Response generation error:', error);
      return language === 'rw'
        ? 'Mbabarira, hari ikibazo. Nyamuneka gerageza nanone. Murakoze.'
        : "I'm sorry, I'm having trouble responding. Please try again. Thank you.";
    }
  }
}

module.exports = new AIService();