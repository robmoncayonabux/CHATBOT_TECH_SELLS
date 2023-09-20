import('node-fetch').then(fetch => {
  global.fetch = fetch.default;
});

const { CoreClass } = require('@bot-whatsapp/bot');
require('dotenv').config()



class ChatGPTClass extends CoreClass {
  queue = []; 
  optionsGPT = { model: "gpt-3.5-turbo-0301" };
  openai = undefined;

  constructor(_database, _provider) {
    super(null, _database, _provider)
    this.init().then();
  }

  /**
   * Esta funciona inicializa
   */
  init = async () => {
    const { ChatGPTAPI } = await import("chatgpt");
    this.openai = new ChatGPTAPI(
        {
            apiKey: process.env.API_TOKEN_AI
        }
    );
  };

  handleMsg = async (ctx) => {
    const {from, body} = ctx
    const interaccionChatGPT = await this.openai.sendMessage(body, {
        conversationId: !this.queue.length
          ? undefined
          : this.queue[this.queue.length - 1].conversationId,
        parentMessageId: !this.queue.length
          ? undefined
          : this.queue[this.queue.length - 1].id,
      });
    this.queue.push(interaccionChatGPT);
    const parseMessage = {
        ...interaccionChatGPT,
        answer: interaccionChatGPT.text
    }

    this.sendFlowSimple([parseMessage], from)
  }
}

module.exports = ChatGPTClass;