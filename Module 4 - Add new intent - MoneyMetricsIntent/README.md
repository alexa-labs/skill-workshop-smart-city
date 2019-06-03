# Module 4: Add the second intent (MoneyMetricsIntent)
In this module, you will add a new intent (MoneyMetricsIntent), and use that to respond back to the customer utterance -  *"what department did we spend the {type: least/most} money on?”:*, collecting the type of query (least/most) from the customer as inputs (we call these slots).

### Objectives
After completing this workshop, you will be able to:

1. Create and configure Intents and sample Utterances using the UI in the developer console
2. Create and configure slots to accept user input using the UI in the developer console

### Overview of what we will be doing in this module

1. **Part 1: Update Interaction Model**
	- Create new custom intent - MoneyMetricsIntent
	- Add sample utterances
	- Create slot for type of request - "least/most", and year
2. **Part 2: Update Code** to handle the functionality for the new intent - MoneyMetricsIntent
	- Add new intent handler for MoneyMetricsIntent
	- Add the new intent handler to exports.handler
	- Collect Slot Values - helper functions
	- Respond back with placeholder speech of - "You asked what department did we spend the {least/most} money on. Let's find the data in the next step by querying the Las Vegas Open Data API"
3. **Part 3: Test your voice interaction**

---
## Part 1: Update Interaction Model

<!--Check if you want to use this here. Came from Module 2.-->

1. Click the **Build** tab
2. To the right of "Slot Types", click **Add**. The Add Slot Type window opens.
3. Select **Create custom slot type** and enter the following text for the name of the slot type: **AmountType**
4. In the Slot Values field, type the following, and then press ENTER or click the + icon:
    - least
    - most
5. Click **Save Model**
6. To the right of Intents, click **Add**. The "Add Intent" window opens.
7. Select **Create custom intent** and enter the following text for the name of the intent: **MoneyMetricsIntent**
8. Click Create custom intent. The intent is created.

  > Remember, an intent is an action to fulfill a user's request. An utterance is what invokes the intent.

9. In the Sample Utterances field, type the following, and then press ENTER or click the + icon:
	- What department was the {amount_type} expensive in {year}
	- What department did we spend the {amount_type} money on in {year}
10. Under the "Intent Slots" section, click the dropdown for each slot to choose the "Slot Type" for the two slots - department, and year.
	- amount_type -> Slot Type = AmountType
	- year -> Slot Type = AMAZON.DATE

	![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/adding-utterances.png)

11. Since we need the amount_type and year to get the information, just like we did in Module 2, we will use Auto Delegation to ensure that our skill guides the customer to collect these values from them before trying to fulfil the request.
	- Click on the slot **amount_type** under MoneyMetricsIntent on the left navigation.
	- Under "Slot Filling", turn on "Is this slot required to fulfill the intent?"
	- Under "Alexa speech prompts", type - **Would you like to get the information for most money spent or least money spent?**, and then hit **enter**
	- Under "User utterances", type - **department that spent {amount_type} money** and **tell me about  {amount_type} money**, and **{amount_type}**, hitting enter each time.

	![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/required-slot.png)

12. **Repeat the process to make "year" required as well. You can use the following prompts:**
	- Under "Alexa speech prompts", type - **what year would you like to get the information for?**, and then hit **enter**
	- Under "User utterances", type - **tell me about {year}** and **{year}**, hitting enter each time

12. Click **Save Model**, and then **Build Model**

> Like we did in Module 2, you may also use the JSON Editor in the left navigation menu to make further changes to the interaction model.

---

## Part 2: Update Code

1. Select the Code tab in the top menu.
2. Add new intent handler for MoneyMetricsIntent, and respond back with placeholder speech of - *"You asked what department did we spend the {least/most} money on. Let's find the data in the next step by querying the Las Vegas Open Data API"*

	> #### Syntax Error?
	> Note that you may receive a syntax error if you try to save the code at this point. This is normal, and will be fixed as you copy the code blocks that follow in the next few steps.

```js
const MoneyMetricsIntentHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest'
      && request.intent.name === 'MoneyMetricsIntent';
	},
	async handle(handlerInput) {
		const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
		const slotValues = getSlotValues(filledSlots);
		let speechText;
		debugLog('slot values',slotValues);

		if (slotValues.amount_type.resolved === 'most') {
			speechText = `You asked what department did we spend the ${slotValues.amount_type.resolved} money on. Let's find the data in the next module by querying the Las Vegas Open Data API`;
		} else {
			speechText = `You asked what department did we spend the ${slotValues.amount_type.resolved} money on. Let's find the data in the next module by querying the Las Vegas Open Data API`;
		}

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
		MoneyMetricsIntentHandler,
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
2. In Alexa Simulator tab, under Type or click…, type "open smart city"
3. You should hear and see Alexa respond with the message in your LaunchRequest.
4. Now, type "what department did we spend the most money on". This utterance should trigger our new intent handler for "MoneyMetricsIntent", and generate the following response -

*"You asked what department did we spend the most money on. Let's find the data in the next step by querying the Las Vegas Open Data API"*

Optional: Feel free to change Alexa's speech output in the Code tab and test to see the direct output!

### Congratulations! You have finished Module 4!

[![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/5.png)](/Module%205%20-%20Respond%20to%20"What%20department%20did%20we%20spend%20the%20most%20money%20on"/README.md)

---

## Code for this module
If your skill isn't working or you're getting some kind of syntax error, download the following working code sample. Go to the Code tab in the Alexa developer console and copy and paste the code into the index.js file. Be sure to save and deploy the code before testing it.

- Code for this module ([4-index.js](4-index.js))
- Interaction Model for this module ([4-en-us.json](4-en-us.json))
