# Module 3: Get External data using Las Vegas Open Checkbook API
In this module, you will replace the placeholder response we set in the last module with actual data returned by calling the [Las Vegas Open Checkbook API](https://opendata.lasvegasnevada.gov/Finance/City-of-Las-Vegas-Checkbook-Data/7erj-ndzx), and including the department name, and year we received from the customer as parameters while queuing the API.

Here's a sample of the data that this API returns for each expenditure incurred by the city of Las Vegas -

You can view the full JSON data [here](https://opendata.lasvegasnevada.gov/resource/p5zs-kxmd.json).


```json
{
	unique_id: "546582819000730100606100",
	department: "OPERATIONS & MAINTENANCE",
	vendor: "FACTORY MOTOR PARTS CO",
	expenditure_activity_type: "Motor Vehicle Parts",
	fund_type: "AUTOMOTIVE OPERATIONS",
	transaction_date: "2017-05-02T00:00:00.000",
	transaction_amount: "405.45",
	month: "5",
	fiscal_month: "11",
	fiscal_year: "2017"
}
```

### Objectives
After completing this workshop, you will be able to:

1. Make an HTTP GET request to an external API
2. Use the slots as part of the API call
3. Parse the the data returned by an API, and use that to respond back to the user with a response like "In {year}, {amount} was spent on {department}"

### Overview of what we will be doing in this module

1. **Part 1: Update Interaction Model**
	- No updates to the interaction model required for this module.
2. **Part 2: Update Code**
	- Require "HTTPS" module
	- Make the API call to get data for the department and year requested by the customer. pass department, and year as slot values
	- Build the response using the data returned by the API
	- Respond back with "In {year}, {amount} was spent on {department}"
3. **Part 3: Test your voice interaction**

---

## Part 1: Update Interaction Model
No updates to the interaction model required for this module.

## Part 2: Update Code

1. Include the "HTTPS" module. Paste the code below just under  `const Alexa = require('ask-sdk-core');` at the top of the file

	```js
	const Alexa = require('ask-sdk-core');
	var https = require('https'); //<- Add this
	var debugMode = true;
	```

2. Update the code inside `MoneySpentIntentHandler` to make the API call to Las Vegas Open Checkbook API to get total amount of money spent on a given department and year provided by the customer using the slot values we collected in the previous module.

This is what `MoneySpentIntentHandler` should look like after the updates.

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
		let speechText;
		debugLog('slot values',slotValues);

		try {
			const response = await httpGetByDepartment(slotValues);
			debugLog('Response from API Call',JSON.stringify(response));
			debugLog('response.length',response.length);

			if (response.length > 0) {
				let expenditureSum = response.reduce((total, expenditure) => total + expenditure.transaction_amount * 1, 0);
				speechText = `So in ${slotValues.year.resolved}, $${expenditureSum.toFixed(2)} was spent on ${slotValues.department.resolved}`;
			} else {
				speechText = `I am sorry I could not find any info
            for ${slotValues.department.resolved} spending in
            ${slotValues.year.resolved}.`;
			}
		} catch (error) {
			speechText = 'I am really sorry. I am unable to access part of my memory. Please try again later';
			console.log(`Intent: ${handlerInput.requestEnvelope.request.intent.name}: message: ${error.message}`);
		}

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt('What would you like?')
			.getResponse();
	},
};
```
	> #### Syntax Error?
	> Note that you may receive a syntax error if you try to save the code at this point. This is normal, and will be fixed as you copy the code blocks that follow in the next few steps.

3. Add the helper function `httpGetByDepartment` that makes the HTTP Get request to the API under "Helper Functions" section

```js
function httpGetByDepartment(slotValues) {
	return new Promise(((resolve, reject) => {

		const department = slotValues.department.resolved.toUpperCase().replace(' AND ', '%20%26%20');
		const year = slotValues.year.resolved;

		var options = {
			host: 'opendata.lasvegasnevada.gov',
			port: 443,
			path: '/resource/p5zs-kxmd.json?department=' + department.replace(' ', '%20') +'&fiscal_year='+ year,
			method: 'GET',
		};
		debugLog('Calling API  =>',options['host'] + options['path']);

		const request = https.request(options, (response) => {
			response.setEncoding('utf8');
			let returnData = '';

			response.on('data', (chunk) => {
				returnData += chunk;
			});

			response.on('end', () => {
				resolve(JSON.parse(returnData));
			});

			response.on('error', (error) => {
				reject(error);
			});
		});
		request.end();
	}));
}
```

4. Click **Save**, and then **Deploy**

## Part 3: Test your voice interaction

We'll now test your skill in the Developer Portal. Here you can test an entire customer interaction with the built-in Alexa simulator.

1. In the menu at top of the page, click **Test**.
2. In Alexa Simulator tab, under Type or click…, type "open smart city"
3. You should hear and see Alexa respond with the message in your LaunchRequest.
5. Now, type "how much money did we spend on fire services this year". This utterance should trigger our intent handler for "MoneySpentIntent", then make a call to the API, and generate a response like -

	"*In 2019, $1203385.22 was spent on fire services*"

Optional: Feel free to change Alexa's speech output in the Code tab and test to see the direct output!

### Congratulations! You have finished Module 3!

[![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/4.png)](/Module%204%20-%20Add%20new%20intent%20-%20MoneyMetricsIntent/README.md)

---

## Code for this module
If your skill isn't working or you're getting some kind of syntax error, download the following working code sample. Go to the Code tab in the Alexa developer console and copy and paste the code into the index.js file. Be sure to save and deploy the code before testing it.

- Code for this module ([3-index.js](3-index.js))
- Interaction Model for this module - Same as Module 2 ([2-en-us.json](/Module%202%20-%20Add%20new%20intent%20-%20MoneySpentIntent/2-en-us.json))
