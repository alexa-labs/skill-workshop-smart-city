# Module 5: Respond to utterance - "What department did we spend the most money on"
In this module, you will replace the placeholder response in the last module with actual data returned by calling the [Las Vegas Open Checkbook API](https://opendata.lasvegasnevada.gov/Finance/City-of-Las-Vegas-Checkbook-Data/7erj-ndzx), and including the year, and type of query (least amount/most amount) we received from the customer as parameters while queuing the API.

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
3. Parse the the data returned by an API, and use that to respond back to the user with a response like "In {year}, the least/most money was spent in the{department}, with a total of {amount_spent}.";


### Overview of what we will be doing in this module
1. **Part 1: Update Interaction Model**
	- No updates to the interaction model required for this module.
2. **Part 2: Update Code**
	- Make the API call to get data for the year requested by the customer, passing type of query (least amount/most amount), and year as parameters.
	- Build the response using the data returned by the API
	- Respond back with "In {year}, the least/most money was spent in the{department}, with a total of {amount_spent}."
3. **Part 3: Test your voice interaction**

---

## Part 1: Update Interaction Model
No updates to the interaction model required for this module.

## Part 2: Update Code

2. Make the API call to Las Vegas Open Checkbook API from within the `MoneySpentIntentHandler` to get total amount of money spent on a given department and year provided by the customer using the slot values we collected in the previous module.

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

		try {
			const response = await httpGetByYear(slotValues);
			debugLog('Response from API Call',JSON.stringify(response));
			debugLog('response.length',response.length);

			if (response.length > 0) {
				console.log('GETTING LIST OF ALL DEPARTMENT NAMES');
				//GET LIST OF ALL DEPARTMENT NAMES
				var all_departments = [];
				response.forEach(function(record, i) {
					all_departments.push(record['department']);
				});

				//FILTER TO UNIQUE DEPARTMENT NAMES
				var unique_departments = all_departments.filter( onlyUnique );
				console.log(unique_departments.length);

				//CREATE AN ARRAY CONTAINING THE DEPARTMMENTS, AND TOTAL AMOUNT SPENT BY EACH UNIQUE DEPARTMENT
				var checkbook = [];

				unique_departments.forEach(function(department, i) {
					var amount_spent = 0;
					response.forEach(function(record, i) {
						if (record['department'] === department){
							amount_spent = amount_spent + parseInt(record['transaction_amount']);
						}
					});
					checkbook.push({department,amount_spent});
				});

				var sorted_checkbook = checkbook.sort((a, b) => a.amount_spent - b.amount_spent);
				console.log(sorted_checkbook);

				var highest_spend = sorted_checkbook[sorted_checkbook.length-1];
				var least_spend = sorted_checkbook[0];

				console.log(highest_spend);
				console.log(least_spend);

				console.log('Most money spent on ' + highest_spend['department'] + ' amounting to ' + highest_spend['amount_spent']);
				console.log('Least money spent on ' + least_spend['department'] + ' amounting to ' + least_spend['amount_spent']);

				if (slotValues.amount_type.resolved === 'most') {
					speechText = `So in ${slotValues.year.resolved}, the most money was spent in the ${highest_spend['department']} department, with a total of $${highest_spend['amount_spent']}.`;
				} else {
					speechText = `So in ${slotValues.year.resolved}, the least money was spent in the ${least_spend['department']} department, with a total of $${least_spend['amount_spent']}.`;
				}
			} else {
				speechText = `I am sorry I could not find any info for spending in ${slotValues.year.resolved}.`;
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

3. Add the helper function that makes the HTTP Get request to the API under "Helper Functions" section

```js
function httpGetByYear(slotValues) {
	return new Promise(((resolve, reject) => {
		const year = slotValues.year.resolved;

		var options = {
			host: 'opendata.lasvegasnevada.gov',
			port: 443,
			path: '/resource/p5zs-kxmd.json?fiscal_year='+ year,
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

4. Add other helper functions

```js
function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}
```

5. Click **Save**, and then **Deploy**

## Part 3: Test your voice interaction

We'll now test your skill in the Developer Portal. Here you can test an entire customer interaction with the built-in Alexa simulator.

1. In the menu at top of the page, click **Test**.
2. In Alexa Simulator tab, under Type or click…, type "open smart city"
3. You should hear and see Alexa respond with the message in your LaunchRequest.
5. Now, type "what department did we spend the most money on in 2018". This utterance should trigger our intent handler for "MoneyMetricsIntent", then make a call to the API, and generate a response like -

	"*In 2018, the most money was spent in the POLICE SERVICES department, with a total of $11854155.*"

Optional: Feel free to change Alexa's speech output in the Code tab and test to see the direct output!

### Congratulations! You have finished Module 5!

[![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/6.png)](/Module%206%20-%20Add%20AMAZON.Repeat%20built-in%20Intent/README.md)

## Code for this module
If your skill isn't working or you're getting some kind of syntax error, download the following working code sample. Go to the Code tab in the Alexa developer console and copy and paste the code into the index.js file. Be sure to save and deploy the code before testing it.

- Code for this module ([5-index.js](5-index.js))
- Interaction Model for this module - Same as Module 4 ([4-en-us.json](/Module%204%20-%20Add%20new%20intent%20-%20MoneyMetricsIntent/4-en-us.json))

