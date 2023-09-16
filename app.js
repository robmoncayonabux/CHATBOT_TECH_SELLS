const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const REGEX_CREDIT_NUMBER = require('./events/creditCard')
const REGEX_EMAIL = require('./events/email')



const flowDocumento = addKeyword(EVENTS.DOCUMENT).addAnswer('Para que este documento?')

const flowMedia = addKeyword(EVENTS.MEDIA).addAnswer('Y que quieres que haga con este archivo media?')

const flowVoiceNote = addKeyword(EVENTS.VOICE_NOTE).addAnswer('Interesante... me has dado un voicenote')

const flowTarjetaDeCredito =addKeyword(REGEX_CREDIT_NUMBER.toString(), { regex: true }).addAnswer('Guau una tarjeta de credito')

const flowEmail =addKeyword(REGEX_EMAIL.toString(), { regex: true }).addAnswer('Si, si ya te envio un correo..')

const flowShaggy = 
addKeyword("shaggy")
.addAnswer("Zoinks", 
{
    media: "https://media.tenor.com/oY2wYWw2y6MAAAAC/shaggy-scared.gif"
})
.addAnswer("Whats new scoobydoo", 
{
    media: "https://s27.aconvert.com/convert/p3r68-cdx67/gitba-xeei8.mp3"
})


const flowPrincipal = addKeyword(EVENTS.WELCOME).addAnswer(
    'Hola Bienvenido a mi testeo de ChatBOT, enviame algo o dime *Shaggy*',
    null,
    null,
    [ flowDocumento, flowEmail, flowMedia, flowShaggy, flowTarjetaDeCredito, flowVoiceNote]
    )


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}



main()
