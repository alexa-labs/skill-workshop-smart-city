## Module 6: Repeat the last response by using “AMAZON.RepeatIntent” - a built-in intent provided by Amazon
In this module, you will add a built-in intent - AMAZON.RepeatIntent. It is one of the many standard built-in intents that lets the user request to repeat the last action. So, our skill will be able to respond back to the utterance “can you repeat that”, “what was that again” etc.

#### Objectives
After completing this workshop, you will be able to:

1. Create and configure a [built-in intent](https://developer.amazon.com/docs/custom-skills/standard-built-in-intents.html)
2. Use [session attributes](https://ask-sdk-for-nodejs.readthedocs.io/en/latest/Managing-Attributes.html#session-attributes) to persist data throughout the lifespan of the current skill session.

### Overview of what we will be doing in this module

1. **Part 1: Update Interaction Model**
	- Add a new built-in intent - AMAZON.RepeatIntent
2. **Part 2: Update Code**
	- Add new intent handler for AMAZON.RepeatIntent
	- Add the new intent handler to exports.handler
	- Save the last response as a session attribute inside the `MoneySpentIntentHandler` and `MoneyMetricsIntentHandler`.
	- Retrieve the session attributes inside the handler for AMAZON.RepeatIntent, and use that to respond back with the last response when asked to repeat.
3. **Part 3: Test your voice interaction**

---
## Part 1: Update Interaction Model

<!--Check if you want to use this here. Came from Module 2.-->

1. Click the **Build** tab
2. To the right of Intents, click **Add**. The "Add Intent" window opens.
3. Select **Use an existing intent from Alexa's built-in library** and type "repeat" to filter down the intents.
4. Choose **AMAZON.RepeatIntent** to add the intent.
5. Click **Save Model**, and then **Build Model**

---

## Part 2: Update Code

1. Select the **Code tab** in the top menu.
2. Update `MoneySpentIntentHandler` to save the last speech response to session attributes.

```js
//Saving last speech response in session attributes
let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
sessionAttributes.last_response = speechText;
handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

return handlerInput.responseBuilder
	.speak(speechText)
	.reprompt('What would you like?')
	.getResponse();
	},
```

3. Add new intent handler for AMAZON.RepeatIntent, and respond back with the last response speech.

```js
const RepeatIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent';
	},
	handle(handlerInput) {
		//Retrieving last speech response from session attributes
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		const speechText = sessionAttributes['last_response'] + '. How can I help?';

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.getResponse();
	}
};
```

3. Add the new intent handler to exports.handler

```js
exports.handler = Alexa.SkillBuilders.custom()
	.addRequestHandlers(
		LaunchRequestHandler,
		MoneySpentIntentHandler,
		MoneyMetricsIntentHandler,
		RepeatIntentHandler, //<- Add this
		HelpIntentHandler,
		CancelAndStopIntentHandler,
		SessionEndedRequestHandler,
		IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
	.addErrorHandlers(
		ErrorHandler)
	.lambda();
```

4. Click **Save**, and then **Deploy**

## Part 3: Test your voice interaction

We'll now test your skill in the Developer Portal. Here you can test an entire customer interaction with the built-in Alexa simulator.

1. In the menu at top of the page, click **Test**.
2. In Alexa Simulator tab, under Type or click…, type "**open smart city**"
3. You should hear and see Alexa respond with the message in your LaunchRequest.
4. Now, type "**what department did we spend the most money on**". This utterance should trigger our new intent handler for "MoneyMetricsIntent", and give us the data by calling the API.
5. Now, type - "**repeat that**"
6. Your skill should now repeat the last response

### Congratulations! You have finished Modules 1-6!
How about some Extra Credits eh? See below.

---

## Code for this module
If your skill isn't working or you're getting some kind of syntax error, download the following working code sample. Go to the Code tab in the Alexa developer console and copy and paste the code into the index.js file. Be sure to save and deploy the code before testing it.

- Code for this module ([index.js](6-index.js))
- Interaction Model for this module ([en-us.json](6-en-us.json))

---

### Extra Credits

1. Add the repeat functionality for `MoneyMetricsIntentHandler` as well. Hint: Use [Response Interceptors](https://developer.amazon.com/blogs/alexa/post/0e2015e1-8be3-4513-94cb-da000c2c9db0/what-s-new-with-request-and-response-interceptors-in-the-alexa-skills-kit-sdk-for-node-js) to avoid duplicating code.
2. [Add Memory to your skill](https://developer.amazon.com/alexa-skills-kit/courses/cake-walk-5)
3. **Add SSML, Sound Effects, and Amazon Polly:** In every interaction of your skill, you will create a more immersive experience for your customer by integrating SSML, Sound Effects, and Amazon Polly to the voice responses.
4. **Make Money with In-Skill Purchasing**: Your customer will be able to purchase premium content within your skill, making their experience more delightful and surprising. Here's a ["Hello World" code sample](https://github.com/alexa/skill-sample-nodejs-premium-hello-world) to get started with.