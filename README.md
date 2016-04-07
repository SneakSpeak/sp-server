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

## API
#### User Authentication
Users are authenticated with GCM Device Token. Eg. `GET /api/user/list?token=<device token>` or `POST /api/user/list {"token": <token>}`.
Routes that require authentication are marked with `*`.

Failing the authentication causes `401`* and `403` responses.

*) Currently the response that should be `401` is actually `400 {"status": 401, "error": <error description>}`.

### GCM
#### `GET /api/gcm/key`
Return Google project number.

### User
#### `GET /api/user`
List of users on the server.
Example request and response:
```
REQUEST GET /api/user

RESPONSE: 200
['user1', 'user2', 'user3']
```

#### `GET/POST /api/user/list *`
Lists users except the authenticated user requesting the list.
Example reques and response for user called `'user1'`:
````
REQUEST POST /api/user/list
{
  "token": abcd1234
}

RESPONSE: 200
['user2', 'user3']
```

### `POST /api/user/register`
Authenticates or creates a new user. Succesfull request redirects to `GET /api/user/list?token=<token>`.

Required fields:
- `username`: Username
- `token`: Device GCM Token


