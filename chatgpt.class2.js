import('node-fetch').then(fetch => {
  global.fetch = fetch.default;
});

//TODO: Esta es la clase sin modificar en donde solo se utiliza el chatGPT netamente.

require('dotenv').config()
const { CoreClass } = require('@bot-whatsapp/bot');


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
            apiKey: process.env.OPENAI_API_KEY
        }
    );
  };

  handleMsg = async (ctx) => {
    const {from, body} = ctx
    

    const parseMessage = {
        ...interaccionChatGPT,
        answer: interaccionChatGPT.text
    }

    this.sendFlowSimple([parseMessage], from)
  }
}

module.exports = ChatGPTClass;