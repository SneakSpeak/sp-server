# sp-server

SneakSpeak server is a [Sails.js](http://sailsjs.org/) app for self hosted chat service. sp-server provides an [HTTP API](#api) to send
messages to individual users and users in a channel. Downstream to clients,
[SneakSpeak Android app](https://github.com/SneakSpeak/sp-android),
is done via [Google Cloud Messaging](https://developers.google.com/cloud-messaging/).

We might add support for Things to send messages to channels.

## Setting Up Development Environment
You will need `npm`, `node` and a local postgresql database, eg. [Postgres.app](http://postgresapp.com/).
```
git clone https://github.com/SneakSpeak/sp-server.git
cd sp-server
npm install
```
Now rename `config/local.js.example` to `config/local.js`and update your GCM
Server Api Key and local postgresql settings at the end of the file. Also make
sure that the postgresql database is up and running.

Start the server with `sails lift` or `npm start`.

## API
#### User Authentication
Users are authenticated with GCM Device Token. Eg.
`GET /api/user/list?token=<device token>` or
`POST /api/user/list {"token": <token>}`.
Routes that require authentication are marked with `*`.

Failing the authentication causes `401`* and `403` responses.

*) Currently the response that should be `401` is actually
`400 {"status": 401, "error": <error description>}`.

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
```
REQUEST POST /api/user/list
{
  "token": abcd1234
}

RESPONSE: 200
['user2', 'user3']
```

### `POST /api/user/register`
Authenticates or creates a new user. Succesfull request redirects to
`GET /api/user/list?token=<token>`.

Required fields:
- `username`: Username
- `token`: Device GCM Token

### `GET /api/user/me *`
Returns the user's own info.
```
GET /api/user/me?token=123 HTTP/1.1
```
```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "token": "123",
    "createdAt": "2016-04-07T11:29:31.000Z",
    "updatedAt": "2016-04-07T13:02:36.000Z",
    "username": "foo",
    "channels": [
        {
            "name": "sp4",
            "public": true,
            "id": 1,
            "createdAt": "2016-04-06T10:51:09.000Z",
            "updatedAt": "2016-04-06T10:51:09.000Z"
        },
        {
            "name": "foobar",
            "public": true,
            "id": 2,
            "createdAt": "2016-04-06T10:58:18.000Z",
            "updatedAt": "2016-04-06T10:58:18.000Z"
        },
        {
            "name": "uberchannel",
            "public": true,
            "id": 4,
            "createdAt": "2016-04-07T12:48:48.000Z",
            "updatedAt": "2016-04-07T12:48:48.000Z"
        }
    ]
}
```

### `POST /api/user/:name/message *`
Sends a GCM XMPP message to the user with username :name.
```
POST /api/user/bar/message HTTP/1.1
Content-Type: application/json

{
    "message": "Hello, user bar!",
    "token": "123"
}
```
```
HTTP/1.1 200 OK
```

## Channel
### `GET /api/channel`
Lists public channels on the server.
```
GET /api/channel HTTP/1.1
```
```
HTTP/1.1 200 OK

[
    {
        "participants": [
            "foo",
            "jorkki"
        ],
        "name": "sp4",
        "public": true,
        "id": 1,
        "createdAt": "2016-04-06T10:51:09.000Z",
        "updatedAt": "2016-04-06T10:51:09.000Z"
    },
    {
        "participants": [
            "foo",
            "jorkki"
        ],
        "name": "foobar",
        "public": true,
        "id": 2,
        "createdAt": "2016-04-06T10:58:18.000Z",
        "updatedAt": "2016-04-06T10:58:18.000Z"
    },
    {
        "participants": [
            "foo",
            "bar"
        ],
        "name": "uberchannel",
        "public": true,
        "id": 4,
        "createdAt": "2016-04-07T12:48:48.000Z",
        "updatedAt": "2016-04-07T12:48:48.000Z"
    }
]
```

### `POST /api/channel/joinOrCreate *`
Joins a channel. If the channel does not exist, creates the channel.
```
POST /api/channel/joinOrCreate HTTP/1.1
Content-Type: application/json


{
    "name": "newChannel",
    "token": "123"
}
```
```
HTTP/1.1 200 OK


{
  "participants": [
    "foo"
  ],
  "name": "newChannel",
  "public": true,
  "id": 6,
  "createdAt": "2016-04-11T06:49:55.000Z",
  "updatedAt": "2016-04-11T06:49:55.000Z"
}
```

### `POST /api/channel/:id/message *`
Sends a GCM XMPP message to all participants of the channel.

```
POST /api/channel/5/message HTTP/1.1
Content-Type: application/json


{
    "message": "Hello newChannel!",
    "token": "456"
}
```
```
HTTP/1.1 200 OK

```
