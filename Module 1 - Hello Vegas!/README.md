# Module 1: Hello Vegas!
In this module, you will create the basic scaffold for the smart city skill using the [Alexa Skills Kit SDK in NodeJS](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs) and [Alexa-Hosted Skill](https://developer.amazon.com/docs/hosted-skills/build-a-skill-end-to-end-using-an-alexa-hosted-skill.html). When launched, this Alexa skill will respond back with a simple *“Hello Vegas"* response.

### Objectives
After completing this workshop, you will be able to:

1. Create and configure a new skill using the Alexa Skills Kit and Alexa Hosted Skills
2. Modify the welcome message when the user launches the skill
3. Test a skill using the Alexa Testing Simulator and an Echo device.

---

## Part 1: Create Skill

1. To get started, log into the [Alexa developer console](https://developer.amazon.com/alexa/console/ask) with your Amazon Developer account. If you do not have an account, [click here](https://www.amazon.com/ap/register?clientContext=131-0331464-9465436&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier\_select&siteState=clientContext%3D142-6935021-1894360%2CsourceUrl%3Dhttps%253A%252F%252Fdeveloper.amazon.com%252Falexa%2Csignature%3Doyixlki7Yxz8bRUtt4vGJ4EugQ8j3D&marketPlaceId=ATVPDKIKX0DER&language=en\_US&pageId=amzn\_developer\_portal&openid.return\_to=https%3A%2F%2Fdeveloper.amazon.com%2Falexa&prevRID=HSRBQ1KHA4E5D1PBHPPP&openid.assoc\_handle=mas\_dev\_portal&openid.mode=checkid\_setup&prepopulatedLoginId=&failedSignInCount=0&openid.claimed\_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier\_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0) to create one.


2. Click **Create Skill** on the right-hand side of the console. A new page displays.

	![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/0-create-skill.png)

3. In the Skill name field, enter **Smart City**
	![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/1-create-skill.png)

4. Leave the **Default language** set to English (US).

5. You are building a custom skill. Under Choose a model to add to your skill, select **Custom**.

	![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/2-create-skill.png)

6. Under Choose a method to host your skill's backend resources, select **Alexa-Hosted**.

	![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/3-create-skill.png)

	> Skills have a front end and backend. The front end is where you map utterances (what the user says) into an intent (the desired action). You must decide how to handle the user's intent in the backend. Host the skill yourself using an AWS Lambda function or HTTPS endpoint, or choose Alexa to host the skill for you. There are limits to the AWS Free Tier, so if your skill goes viral, you may want to move to the self-hosted option. For this course, use Alexa-Hosted.

7. At the top of the page, click **Create skill**.

	![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/4-create-skill.png)

	> It takes a few moments for AWS to provision resources for your skill. When this process completes, move to the next section.

	![](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/training/cakewalk/building-a-skill-2f-2.png)


## Part 2: Update code to greet the user

### What should happen when a user launches the Smart City skill?
The first thing a user will want to do with the skill is open it. In this case, you want the skill to simply confirm that the user opened it by saying, *"Hello! Welcome to Las Vegas Smart City Skill. Goodbye!"*

The intent of opening the skill is built into the experience (`LaunchRequest`), so you don't need to define this intent in your front end. However, you do need to respond to the intent in your backend (`LaunchRequestHandler`). In this step, you will update your backend code to greet the user when they open the skill by updating the intent handler for `LaunchRequest`.

### There are **two** pieces to a handler
> 1. canHandle() function
>
> 2. handle() function
>
> The **canHandle()** function is where you define what requests the handler responds to.
>
> The **handle()** function returns a response to the user.
>
> If your skill receives a request, the canHandle() function within each handler determines whether or not that handler can service the request.
>
> In this case, the user wants to launch the skill, which is a LaunchRequest. Therefore, the canHandle() function within the LaunchRequestHandler will let the SDK know it can fulfill the request. In computer terms, the canHandle returns true to confirm it can do the work.


1. Open the Smart City skill in the Alexa developer console. Click the **Code tab**. The code editor opens the index.js file.

	> You will use the ASK SDK for Node.js module. To define how your skill responds to a JSON request, you will define a handler for each intent.

	![](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/training/cakewalk/building-a-skill-3-1.png)

2. Within the `LaunchRequestHandler` object, find the `handle()` function. This function uses the responseBuilder function to compose and return the response to the user.

2. Within the `handle()` function, find the line that begins const `speechText`. This variable contains the string of words the skill should say back to the user when they launch the skill. Let's change what it says to make sense for this skill.

3. **Update code for LaunchRequestHandler**: Within the LaunchRequestHandler object, find the handle() function, and the line that begins const speechText. Replace that line with the following:

	```js
	const speechText = 'Hello! Welcome to Las Vegas Smart City Skill. Goodbye!';
	```

4. Within the `LaunchRequestHandler`, in the `handle()` function, find the line that begins with `.reprompt()`. Add a double forward slash (//) at the beginning of the line. This turns the line into a comment, meaning the line is ignored when the code runs. We will come back and uncomment it later.

5. Next, look for the `.getResponse()` function just below the line you commented out in the `LaunchRequestHandler`. This converts the responseBuilder's work into the response that the skill will return. Think of it like hitting a "send" button — it sends the response.

	**Final code for LaunchRequestHandler**: After making all of these changes, your code in the handle() function within the LaunchRequestHandler should look like the following:

```js
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Hello! Welcome to Las Vegas Smart City Skill. Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt(speechText)
            .getResponse();
    }
};
```
6. **Enable Logging:** Before we test our skill, let's add one more functionality that will help us debug our code in the following modules. We will add a custom logging function called debugLog that we can turn on/off at our discretion.

Add the debug flag on the line following the import of the ASK SDK. Paste the code below just under  `const Alexa = require('ask-sdk-core');` at the top of the file
```js
const Alexa = require('ask-sdk-core');
var debugMode = true; // <-- add this line
```

Directly before the `exports.handler = Alexa.SkillBuilders.custom()` section, create this helper function. We'll be adding more to this section later in the workshop.
```js
//HELPER FUNCTIONS

function debugLog(logTitle,logBody,){
	if (debugMode) {
		console.log('**** START: PRINTING ' + logTitle.toUpperCase() + ' ****');
		console.log(logBody);
		console.log('**** END: PRINTING ' + logTitle.toUpperCase() + ' ****');
	}
}
```

7. Click **Save**

![](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/training/cakewalk/building-a-skill-3-save.png)

8. Click **Deploy**

![](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/training/cakewalk/building-a-skill-3-deploy.png)

## Part 3: Test your voice interaction
Now it is time to test the skill. Start by activating the test simulator.

1. Click the **Test tab**. The test simulator opens.

	![](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/training/cakewalk/building-a-skill-4-1.jpg)

	> An alert may appear requesting to use your computer's microphone. Click Allow to enable testing the skill with your voice, just like if you were talking to an Alexa-enabled device.
	>
	> ![](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/training/cakewalk/building-a-skill-4-2.png)

2. From the drop-down menu at the top left of the page, select **Development**.

	![](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/training/cakewalk/building-a-skill-4-3.png)

	> ### Testing inside the developer console
	> There are two ways to test your skill in the console. With the first method, type what the user would say into the box at the top left. Be precise—spelling matters! Alternately, speak to the skill by clicking and holding the microphone icon and speaking.

	> So far, the skill has one intent: LaunchRequest. This function responds to the user when they ask Alexa to open or launch the skill. The user will say, "Alexa, open Smart City." Smart City is the name of your skill and was automatically set as the invocation name for the skill. You can change the invocation name, but let's leave it as is for this exercise.

	> ### Invocation Name
	Your invocation name should be default set to: **smart city**. This will be the name that you will use to start your skill (eg., "Alexa, open smart city")

	> The invocation name you choose needs to be more than one word and not contain a brand name. Remember the invocation name for future use in this lab.


3. Test the skill. Type **open smart city** (not case sensitive) into the box at the top left and press ENTER, or click and hold the microphone icon and say, "open smart city."

	![;](http://ajotwani.s3.amazonaws.com/ask-workshop/images/5-create-skill.png)

	> When testing your skill in the Alexa developer console, you don't need to provide the wake word (usually "Alexa"). Typing or saying, "Open Smart City" is fine. When testing on an Alexa-enabled device, you need the wake word: "Alexa, open Smart City."

## Wrap-up
When you open the skill, does it say, “Hello! Welcome to Las Vegas Smart City Skill. Goodbye!”? If so, congratulations! You have laid the groundwork for the skill. You will be building new skills with compelling conversational voice experiences in no time.

There is still a lot to learn! In the next section, you will expand the skill to make it more useful by adding a new intent, and capturing user input through slots.

### Congratulations! You have finished Module 1!

[![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/2.png)](/Module%202%20-%20Add%20new%20intent%20-%20MoneySpentIntent/README.md)

---

## Code for this module
If your skill isn't working or you're getting some kind of syntax error, download the following working code sample. Go to the Code tab in the Alexa developer console and copy and paste the code into the index.js file. Be sure to save and deploy the code before testing it.

- Code for this module ([1-index.js](1-index.js))
- Interaction Model for this module ([en-us.json](1-en-us.json))