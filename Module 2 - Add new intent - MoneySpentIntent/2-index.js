// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
var debugMode = true;

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		const speechText = 'Welcome to the Las Vegas Smart City Checkbook Skill. You can ask how much money was spent by the City of Las Vegas on a department in a certain year. For example, you can say how much money was spent on fire services in 2018. What would you like to know?';
		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.getResponse();
	}
};
const MoneySpentIntentHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest'
      && request.intent.name === 'MoneySpentIntent';
	},
	async handle(handlerInput) {
		const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
		const slotValues = getSlotValues(filledSlots);
		let speechText = `You asked for the amount of money spent on ${slotValues.department.resolved} in ${slotValues.year.resolved}. Let's find the data in the next module by querying the Las Vegas Open Data API`;
		debugLog('slot values',slotValues);

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt('What would you like?')
			.getResponse();
	},
};

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
const CancelAndStopIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
	},
	handle(handlerInput) {
		const speechText = 'Goodbye!';
		return handlerInput.responseBuilder
			.speak(speechText)
			.getResponse();
	}
};
const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
	},
	handle(handlerInput) {
		// Any cleanup logic goes here.
		return handlerInput.responseBuilder.getResponse();
	}
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest';
	},
	handle(handlerInput) {
		const intentName = handlerInput.requestEnvelope.request.intent.name;
		const speechText = `You just triggered ${intentName}`;

		return handlerInput.responseBuilder
			.speak(speechText)
		//.reprompt('add a reprompt if you want to keep the session open for the user to respond')
			.getResponse();
	}
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		console.log(`~~~~ Error handled: ${error.message}`);
		const speechText = 'Sorry, I couldn\'t understand what you said. Please try again.';

		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.getResponse();
	}
};

//HELPER FUNCTIONS

function debugLog(logTitle,logBody,){
	if (debugMode) {
		console.log('**** START: PRINTING ' + logTitle.toUpperCase() + ' ****');
		console.log(logBody);
		console.log('**** END: PRINTING ' + logTitle.toUpperCase() + ' ****');
	}
}

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

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
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