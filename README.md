# SiteMinder Failover mail service

## Description

A service that accepts the necessary email information, after which, sends the email. 
In addition, this service has a primary and secondary email providers and, if the primary provider 
fails to send the request, the secondary provider will send the request.
 
## Todo

- Fix vunerabilities of specified versions as specified in my GITHUB after I committed the code. 
When taking a brief look and changing the fastify version this caused the tests to fail with a strange error.
- Add more tests to check validation and fail over
- Add better eslinting probably Airbnb
- Add the ability to overide the 'from' email field
- Provide better failover eg. retry and reporting that an issue exists. 
- Add extra validation outside of Fastify schema
 
## Prerequisites

Please ensure that the latest version of NPM and NodeJs are installed 

## Installing

```
yarn 
```

## Run application in dev
set .env file with:

```
MAILGUN_API_KEY=<apiKey>
SENDGRID_API_KEY=<apiKey>
```
```
'npm run dev' or 'npm run watch' (recompiles and restarts server when code is updated)
```

## Run application

Please ensure that MAILGUN_API_KEY=<apiKey> and SENDGRID_API_KEY=<apiKey> are set up environment variable on server before running

```
npm start (when deployed to server)
```

## Running the tests
```
npm run test
```
## Validation

- Validation is achieved by use of Fastify schema
- Required fields are 'Subject' and 'To'. Failure to add these field will cause request to fail.

## Usage (from REST Client)

- Use a REST client like POSTMAN or Bangarang Chrome plugin
- Request: POST https://site-minder-mail-service.herokuapp.com/api/send/email
- Body (example):
```
{
  "subject" : "subject",
  "to" : [{"email": "caruanapaul023@gmail.com", "name": "Paul Caruana"}],
  "body": "This has a body ok"
}
```
- Response (example):
```
{
    "provider": "Mail Gun",
    "message": "Queued. Thank you.",
    "status": 200,
    "messageId": "<20200308030116.1.616ED2AA35C788D7@sandboxcf31ef7cad4848c7a13fa17c3deb9667.mailgun.org>"
}
```

To test the failover, use the following payload where the user "paul.q.borg@gmail.com" is not permitted on MailGun as it has not been setup:
```
{
  "subject" : "subject",
  "to" : [{"email": "caruanapaul023@gmail.com", "name": "Paul Caruana"}],
  "cc" : [{"email": "paul.qq.borg@gmail.com", "name": "Paul Borg"}],
  "bcc" : [{"email": "nobody@gmail.com"}],
  "body": "This has a body ok"
}
```

This will return the following payload: 
```
{
    "provider": "Send Grid",
    "message": "Successfully queued",
    "status": 200,
    "messageId": 1583638714381,
    "primaryError": {
        "provider": "Mail Gun",
        "message": "Sandbox subdomains are for test purposes only. Please add your own domain or add the address to authorized recipients in Account Settings.",
        "status": 400
    }
}
```
## Author

**Paul Caruana** 

## Demo
https://site-minder-mail-service.herokuapp.com/api/send/email

