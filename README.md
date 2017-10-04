Projeto de estudo com NODE.js Express.js e EJS como template engine.

Baixar projeto e rodar os comandos
- npm i
- npm run build
- npm run start

Obs: SE NAO TIVER O MONGO RODANDO LOCALMENTE NA MAQUINA EDITE O ARQUIVO index.js
- comentar linha 145:	
	// Mlab Heroku
	const url = process.env.MONGODB_URI;

- decomentar linha 142:
	// const url = 'mongodb://felipe:1qazxsw2@ds147544.mlab.com:47544/tanamesa'

