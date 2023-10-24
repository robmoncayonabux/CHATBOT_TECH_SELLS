//TODO: Despues de hacer clone al repositorio
Necesitaras crear un archivo .env que contenga exactamente los nombres que podemos encontrar en el archivo .env.example

Para poder llenar esta informacion sera necesario que te crees un correo de acceso en google console (buscalo en google tal cual..)

Una vez dentro, si ya tienes una cuenta haz login, si no tienes uno haz sign up.

Cuando estes dentro sigue los siguientes pasos:
1.- Crea un proyecto (Si ya tienes uno, puedes usar ese)
2.- Ve a la opcion IAM y administracion
3.- Busca la opcion "Cuentas de servicio"
4.- Dentro de esta opcion busca la opcion "+CREAR CUENTA DE SERVICIO" y crea un servicio, con esto te creara un "correo", ese "servicio" es tu "GOOGLE_SERVICE_ACCOUNT_EMAIL" en tu .env (RECUERDA QUE ESTE CORREO DEBE TENER ACCESO EN TU GOOGLESHEET, COMO EL CORREO "frescosh" que yo tengo)
5.- En esa misma pestaña busca tu servicio creado y dale click a los tres puntos, click en la opcion ADMINISTRAR CLAVE y luego AGREGAR CLAVE, creas una clave nueva y que sea en formato JSON... la opcion "private_key" es tu "GOOGLE_PRIVATE_KEY" en tu .env
6.-Por ultimo, ve a la opcion IAM y dale click a OTORGAR ACCESO, en "principales nuevas" coloca el correo de tu servicio y dale el siguiente role: Administrador de la API de Dialogflow 

//TODO: Una vez hecho todo lo anterior...

npm install

//TODO: Para finalmente darle inicio al ChatBot

npm start

//TODO: Recuerda escanear el codigo QR que lo podemos encontrar en el documento como bot.qr.png





//TODO: Actualizacion del servicio del ChatBOT (Estar atento a Discord de Leifer en caso de alguna correccion de bug de libreria)
npm install @bot-whatsapp/bot@latest @bot-whatsapp/cli@latest @bot-whatsapp/database@latest @bot-whatsapp/portal@latest