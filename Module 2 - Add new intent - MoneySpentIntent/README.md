# Module 2: Add a custom Intent, and respond with a placeholder response
In addition to the built-in intents, this skill will use a few custom intents. In this module, you will add a new intent (MoneySpentIntent), and use that to respond to the customer utterance - *“how much money did we spend on {department} in {year}”*, collecting the department name, and year from the customer as inputs (we call these slots).

### Objectives
After completing this workshop, you will be able to:

1. Create and configure Intents and sample Utterances using the JSON Editor
2. Create and configure slots to accept user input using the JSON Editor
3. Turn on Auto Delegation to collect slot values from the customer
3. Keep the session open by adding a reprompt to LaunchRequestHandler

### Overview of what we will be doing in this module

1. **Part 1: Update Interaction Model**
	- Create new custom intent - MoneySpentIntent
	- Add sample utterances
	- Create slots - department and year
2. **Part 2: Update Code** to handle the functionality for the new intent - MoneySpentIntent
		- Add new intent handler for MoneySpentIntent
  	- Add the new intent handler to exports.handler
  	- Collect Slot Values - helper functions
  	- Keep the session open by adding a reprompt to LaunchRequestHandler
  	- Respond back with placeholder speech of - "You asked for {department} in {year}. Let's find the data in the next step by querying the Las Vegas Open Data API"
		- Update the response inside HelpIntentHandler to inform the customers about the new functionality.
3. **Part 3: Test your voice interaction**

---

## Part 1: Update Interaction Model

1. Click the **Build** tab
2. In the **left navigation menu** on the left, choose **JSON Editor**.
3. **Copy/Paste** the language model JSON from the starting [2-start-en-us.json](2-start-en-us.json) into this editor.

  > Each of these JSON fields are Intents. Intents represent what your skill can do, they are an action Alexa will take. To prompt Alexa for the action, a user would say an Utterance. Each intent has various utterances acting as training data for Alexa to understand the context of the action. Alexa responds in a different way for each intent.

4. Click the **Save Model** button. This will start the process of creating your interaction (If you did not make changes in the Code Editor the Save Model button is gray).
5. Click on the **MoneySpentIntent** on the **left menu**. You are now in a UI where you can incorporate more sample utterances for your custom intent. Add each of the following utterances individually:

	- tell me the money spent on {department} in {year}
	- give me the checkbook for {department} in {year}

  > Notice that the text does not include punctuation.

6. Since we need the department and year to get the information, we will use Auto Delegation to ensure that our skill guides the customer to collect these values from them before trying to fulfil the request.
	- Click on the slot **department** under MoneySpentIntent on the left navigation.
	- Under "Slot Filling", turn on "Is this slot required to fulfill the intent?"
	- Under "Alexa speech prompts", type - **What department would you like to get the information for. You can say fire services, operations and maintenance, or planning and development?**, and then hit **enter**
	- Under "User utterances", type the following, hitting enter each time -
		- **tell me about {department}**
		- **{department}**

	![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/required-slot.png)

7. **Repeat the process to make "year" required as well. You can use the following prompts:**
	- Under "Alexa speech prompts", type - **what year would you like to get the information for?**, and then hit **enter**
	- Under "User utterances", type - **tell me about {year}** and **{year}**, hitting enter each time

8. **Save Model**, and then click on **Build Model**

---

## Part 2: Update Code

1. Select the Code tab in the top menu.
	> You will now see the code that performs actions for Alexa to respond to the customer's request. We used the "Hello World" NodeJS template, and need to update the functions to match our skill's interaction model.

2. Add code for the new intent handler for MoneySpentIntent, and respond back with placeholder speech of - *"You asked for {department} in {year}. Let's find the data in the next step by querying the Las Vegas Open Data API"*

	> #### Syntax Error?
	> Note that you may receive a syntax error if you try to save the code at this point. This is normal, and will be fixed as you copy the code blocks that follow in the next few steps.

```js
const MoneySpentIntentHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest'
      && request.intent.name === 'MoneySpentIntent';
	},
	async handle(handlerInput) {
		const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
		const slotValues = getSlotValues(filledSlots);
		let speechText = `You asked for the amount of money spent on ${slotValues.department.resolved} in ${slotValues.year.resolved}. Let's find the data in the next step by querying the Las Vegas Open Data API`;
		debugLog('slot values',slotValues);

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt('What would you like?')
			.getResponse();
	},
};
```

3. Add the new intent handler to exports.handler

```js
exports.handler = Alexa.SkillBuilders.custom()
	.addRequestHandlers(
		LaunchRequestHandler,
		MoneySpentIntentHandler,
		HelpIntentHandler,
		CancelAndStopIntentHandler,
		SessionEndedRequestHandler,
		IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
	.addErrorHandlers(
		ErrorHandler)
	.lambda();
```

4. Collect Slot Values using the `getSlotValues` helper function

```js
function getSlotValues(filledSlots) {
	const slotValues = {};

	console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);
	Object.keys(filledSlots).forEach((item) => {
		const name = filledSlots[item].name;

		if (filledSlots[item] &&
        filledSlots[item].resolutions &&
        filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
        filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
        filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
			switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
			case 'ER_SUCCESS_MATCH':
				slotValues[name] = {
					synonym: filledSlots[item].value,
					resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
					isValidated: true,
				};
				break;
			case 'ER_SUCCESS_NO_MATCH':
				slotValues[name] = {
					synonym: filledSlots[item].value,
					resolved: filledSlots[item].value,
					isValidated: false,
				};
				break;
			default:
				break;
			}
		} else {
			slotValues[name] = {
				synonym: filledSlots[item].value,
				resolved: filledSlots[item].value,
				isValidated: false,
			};
		}
	}, this);

	return slotValues;
}
```

5. Keep the session open by adding a reprompt to LaunchRequestHandler

```js
const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		const speechText = 'Welcome to the Las Vegas Smart City Checkbook Skill. What would you like to know?';
		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.getResponse();
	}
};
```

6. Update the HelpIntentHandler

```js
const HelpIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
	},
	handle(handlerInput) {
		const speechText = 'You can ask how much money was spent by the City of Las Vegas on a department in a certain year. Here are a few departments you can ask about - fire services, planning and development, operations and maintenance, What would you like to know?';

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.getResponse();
	}
};
```

7. Click **Save**, and then **Deploy**

## Part 3: Test your voice interaction

We'll now test your skill in the Developer Portal. Here you can test an entire customer interaction with the built-in Alexa simulator.

1. In the menu at top of the page, click **Test**.
2. In Alexa Simulator tab, under Type or click…, type "**open smart city**"
3. You should hear and see Alexa respond with the message in your LaunchRequest - *Welcome to the Las Vegas Smart City Checkbook Skill. What would you like to know?*. Note that it also keeps the session open, and encourages you to continue the conversation. This is because we uncommented the `.reprompt()` statement in our `LaunchRequestHandler` in Part 2 above.
4. Now, type "**how much money did we spend on fire services this year**". This utterance should trigger our new intent handler for "MoneySpentIntent", and generate the following response -

	*"You asked for the amount of money spent on fire services in 2019. Let's find the data in the next step by querying the Las Vegas Open Data API"*

	***Optional:*** Feel free to change Alexa's speech output in the Code tab and test to see the direct output!

### Congratulations! You have finished Module 2!

[![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/3.png)](/Module%203-%20Get%20data%20from%20Las%20Vegas%20Open%20Checkbook%20API/README.md)

---

## Code for this module
If your skill isn't working or you're getting some kind of syntax error, download the following working code sample. Go to the Code tab in the Alexa developer console and copy and paste the code into the index.js file. Be sure to save and deploy the code before testing it.

- Code for this module ([2-index.js](2-index.js))
- Interaction Model for this module ([2-en-us.json](2-en-us.json))
