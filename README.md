# Chatbot Challenge 🤖

> Build a Node.js program that communicates with a chatbot.

Welcome to the Rival technologies chatbot challenge 🎉! We are
excited that you are interested in working with our team in Vancouver, BC and
helping us expand our next gen market research platform.

To give you an idea of the kind of work we do, our engineering team developed a
chatbot that is looking forward to communicating with you.

All you need to do is start a conversation and reply to the chatbot to keep the
conversation going.

## Acceptance Criteria

Everything we do is based on acceptance criteria, this chatbot challenge is no
different. Here we go:

* Your program is written in Node.js.
* Your code is ready for production.
  * We prefer you prioritize the quality of your code over completing the tasks
    by hacking something together. You should be proud of your code and it should
    be easy to understand.
* Your replies are generic and not hard-coded.
  * Why? We provide you with a single conversation endpoint, but will run your
    program against different question sets during your on-site presentation.

***One final note: Please do NOT create a UI that allows you to type messages to the bot, that defeats the purpose of this challenge.  You are programming your own bot to talk to the Rival chat bot, it should not require your manual user intervention in any way other than to start the conversation.***

## Conversation Flow

The following flow diagram outlines the conversation flow visually:

![Chatbot conversation flow](./chatbot-challenge-flow.png)

## API

The chatbot exposes an HTTPS endpoint at https://code-challenge.us1.sandbox-rivaltech.io,
referred to as the `$BASE_URL`. All URLs listed below are relative to this
endpoint.

## `POST /challenge-register` - Account Creation

The very first step is to create an account.

Request:

```bash
curl --request POST \
  --url $BASE_URL/challenge-register \
  --header 'content-type: application/json' \
  --data '{
	"name": "Jane Doe",
	"email": "jane@doe.com"
}'
```

Response:

```json
{
  "user_id": "<YOUR USER ID>"
}
```

## `POST /challenge-conversation` - Inititalize the conversation

In order to communicate with the bot, you need a conversation ID.

Request:

```bash
curl --request POST \
  --url $BASE_URL/challenge-conversation \
  --header 'content-type: application/json' \
  --data '{
	"user_id": "<YOUR USER ID>"
}'
```

Response:

```json
{
  "conversation_id": "<YOUR CONVERSATION ID>"
}
```

## `GET /challenge-behaviour/<YOUR CONVERSATION ID>` - Retrieve new messages

Use this endpoint to retrieve new messages. Once you answer a bot's question
correctly, you can use this endpoint to continue the conversation and get the
next question.

Request:

```bash
curl --request GET \
  --url $BASE_URL/challenge-behaviour/<YOUR CONVERSATION ID> \
  --header 'content-type: application/json'
```

Response:

```
{
  "messages": [{
    "text": "<The chatbot message>"
  }]
}
```

**NOTE**: The chatbot may reply with multiple messages. Your program can focus on
the last element in the array to continue the conversation.

**HINT**: This is where you parse the chatbot's message, figure out how to reply
and then get ready to reply back to the chatbot (see next chapter).

## `POST /challenge-behaviour/<YOUR CONVERSATION ID>` - Reply to the chatbot

Once you've parsed the chatbot's messages and figured out how to reply, send your
reply to the chatbot.

Request:

```bash
curl --request POST \
  --url $BASE_URL/challenge-behaviour/<YOUR CONVERSATION ID> \
  --header 'content-type: application/json' \
  --data '{
	"content": ""
}'
```

**NOTE**: The `content` property is always a string. If the bot asks you a
"yes/no" question, simply reply with "yes" as the `content` value. If the bot
asks for a list of elements, reply with a comma-separate list such as
"banana,orange,pineapple". For numbers, the `content` property is still a
string, e.g. `{"content": "42"}`.

Response:

```json
{
  "correct": true | false
}
```

If the chatbot replies with `true`, it's time to retrieve the next message with
the `GET /challenge-behaviour/<YOUR CONVERSATION ID>` endpoint documented above.

If you receive `false`, the chatbot didn't like your answer.

## Code submission

Congratulations 🙌! It's time to submit your code and prepare for your on-site
presentation. Please email your Node.js project to peter@rivaltech.com.
