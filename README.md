# sp-server

a [Sails](http://sailsjs.org) application

## Setting Up Development Environment
You will need `npm`, `node` and a local postgresql database, eg. [Postgres.app](http://postgresapp.com/).
```
git clone https://github.com/SneakSpeak/sp-server.git
cd sp-server
npm install
```
Now rename `config/local.js.example` to `config/local.js`and update your GCM Server Api Key and local postgresql settings at the end of the file. Also make sure that the postgresql database is up and running.

Start the server with `sails lift` or `npm start`.

