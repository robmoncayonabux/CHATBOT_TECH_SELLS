const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const REGEX_CREDIT_NUMBER = require('./utils/regexCreditCard')
const REGEX_EMAIL = require('./utils/email')



const flowDocumento = addKeyword(EVENTS.DOCUMENT).addAnswer('Para que este documento?')

const flowMedia = addKeyword(EVENTS.MEDIA).addAnswer('Y que quieres que haga con este archivo media?')

const flowVoiceNote = addKeyword(EVENTS.VOICE_NOTE).addAnswer('Interesante... me has dado un voicenote')

const flowTarjetaDeCredito =addKeyword(REGEX_CREDIT_NUMBER.toString(), { regex: true }).addAnswer('Guau una tarjeta de credito')

const flowEmail =addKeyword(REGEX_EMAIL.toString(), { regex: true }).addAnswer('Si, si ya te envio un correo..')

module.export = [flowDocumento, flowMedia, flowEmail, flowTarjetaDeCredito, flowVoiceNote]