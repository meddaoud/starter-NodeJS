/*
 * bot.js
 *
 * In this file:
 * - received message from a connected channel will be transformed with Recast.AI SDK
 * - received message from test command will be processed by Recast.AI
 *   You can run this command for testing:
 *   curl -X "POST" "http://localhost:5000" -d '{"text": "YOUR_TEXT"}' -H "Content-Type: application/json; charset=utf-8"
 *
 *
 * The Recast.AI SDK will handle the message and call your reply bot function (ie. replyMessage function)
 */

const recastai = require('recastai').default

const replyMessage = require('./message')

// Instantiate Recast.AI SDK
const client = new recastai(process.env.REQUEST_TOKEN)

/*
 * Main bot function
 * Parameters are:
 * - body: Request body
 * - response: Response of your server (can be a blank object if not needed: {})
 * - callback: Callback is a function called by Recast.AI hosting system when your code will be hosted
 */
export const bot = (body, response, callback) => {
  if (body.message) {
    /*
    * Call the Recast.AI SDK function to handle message from Bot Connector
    * This function will:
    * - Return a response with the status code 200
    * - Create a Message object, easily usable in your code
    * - Call the 'replyMessage' function, with this Message object in parameter
    *
    * If you want to edit the behaviour of your code bot, depending on user input,
    * go to /src/message.js file and write your own code under "YOUR OWN CODE" comment.
    */
    client.connect.handleMessage({ body }, response, replyMessage)

    /*
     * This function is called by Recast.AI hosting system when your code will be hosted
     */
    callback(null, { result: 'Bot answered :)' })
  } else if (body.text) {
    /*
    * If your request comes from the testing route
    * ie curl -X "POST" "https://localhost:5000" -d '{"text": "YOUR_TEXT"}' -H "Content-Type: application/json; charset=utf-8"
    * It just sends it to Recast.AI and returns replies
    */
    client.request.converseText(body.text, { conversationToken: process.env.CONVERSATION_TOKEN || null })
      .then((res) => {
        if (res.reply()) {
          /*
           * If response received from Recast.AI contains a reply
           */
          callback(null, {
            reply: res.reply(),
            conversationToken: res.conversationToken,
          })
        } else {
          /*
           * If response received from Recast.AI does not contain any reply
           */
          callback(null, {
            reply: 'No reply :(',
            conversationToken: res.conversationToken,
          })
        }
      })
      .catch((err) => {
        callback(err)
      })
  } else {
    callback('No text provided')
  }
}








const recastai = require('recastai').default
const client = new recastai(process.env.REQUEST_TOKEN)
const request = require('request')

const replyMessage = (message, text, res) => {
  const recastaiReq = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)
  const content = (message ? message.content : text)

  recastaiReq.analyseText(content)
    .then(recastaiRes => {
      const intent = recastaiRes.intent()
      console.log(intent)

      if (intent && intent.slug === 'greetings') {
        const reply = {
          type: 'quickReplies',
          content: {
            title: 'Hi! What can I do for you?',
            buttons: [
              {
                title: 'Chuck Norris fact',
                value: 'Tell me a joke',
              },
              {
                title: 'Goodbye',
                value: 'Goodbye',
              },
            ],
          },
        }

        return message ? message.reply([reply]) : res.json({ reply: 'Hi, what can I do for you? :-)' })
      }

      if (recastaiRes.entities.hasOwnProperty('category')) {
        request('https://api.chucknorris.io/jokes/categories', (_err, _res, body) => {
          const response = JSON.parse(body)
          const category = recastaiRes.entities.category[0].value
          if (response.indexOf(category)) {
            request(`https://api.chucknorris.io/jokes/random?category=${category}`, (_err, _res, body) => {
              body = JSON.parse(body)
              const content = body.value

              return message ? message.reply([{ type: 'text', content }]).then() : res.send({ reply: content })
            })
          } else {
            request('https://api.chucknorris.io/jokes/categories', (_err, _res, body) => {
              body = JSON.parse(body)
              const content = `Sorry, I only know about these categories: ${body.join(', ')}.`

              return message ? message.reply([{ type: 'text', content }]).then() : res.send({ reply: content })
            })
          }
        })
      } else {
        request('https://api.chucknorris.io/jokes/random', (_err, _res, body) => {
          body = JSON.parse(body)
          const content = body.value

          return message ? message.reply({ type: 'text', content }).then() : res.send({ reply: content })
        })
      }
    })
}

export const bot = (body, response, callback) => {
  console.log(body)

  if (body.message) {
    client.connect.handleMessage({ body }, response, replyMessage)
    callback(null, { result: 'Bot answered :)' })
  } else if (body.text) {
    replyMessage(null, body.text, response)
  } else {
    callback('No text provided')
  }
}
