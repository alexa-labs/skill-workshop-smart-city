
# Alexa Workshop: Smart Cities Are The Future
<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/fact/header._TTH_.png" />
Imagine being able to look at every single data point your city generates, and creating compelling applications from that data. This workshop will introduce you to the [Las Vegas Open Checkbook API](https://opendata.lasvegasnevada.gov/Finance/City-of-Las-Vegas-Checkbook-Data/7erj-ndzx), and show you how to build a voice application with Alexa that consumes that data, and takes a unique look at just how interactive our future can be.

### What you will learn in this workshop
- Alexa Skills Kit
- Alexa Hosted Skills
- Intents (Built-in and Custom), Utterances, and Slots
- ASK NodeJS SDK
- Making an external API call to get data from Las Vegas Open Checkbook API

## Overview

This workshop is split into 6 modules, with each module building off the previous.

### Module 1: Hello Vegas!
In this module, you will create the basic scaffold for the smart city skill using the Alexa Skills Kit SDK in NodeJS and Alexa Hosted. When launched, this Alexa skill will respond back with a simple “Hello Vegas" response.

### Module 2: Add your first custom  Intent, and respond with a placeholder response
In addition to the built-in intents, this skill will use a few custom intents. In this module, you will add a new intent (MoneySpentIntent), and use that to respond to the customer utterance - *“how much money did we spend on {department} in {year}”*, collecting the department name, and year from the customer as inputs (we call these slots).

### Module 3: Get External data using Las Vegas Open Checkbook API
In this module, you will replace the placeholder response we set in the last module with actual data returned by calling the [Las Vegas Open Checkbook API](https://opendata.lasvegasnevada.gov/Finance/City-of-Las-Vegas-Checkbook-Data/7erj-ndzx), and including the department name, and year we received from the customer as parameters while queuing the API.

### Module 4: Add the second intent (MoneyMetricsIntent)
In this module, you will add a new intent (MoneyMetricsIntent), and use that to respond back to the customer utterance -  *"what department did we spend the {type: least/most} money on?”:*, collecting the type of query (least/most) from the customer as inputs (we call these slots).

### Module 5: Respond to utterance "What department did we spend the most money on"
In this module, you will replace the placeholder response in the last module with actual data returned by calling the [Las Vegas Open Checkbook API](https://opendata.lasvegasnevada.gov/Finance/City-of-Las-Vegas-Checkbook-Data/7erj-ndzx), and including the year, and type of query (least amount/most amount) we received from the customer as parameters while queuing the API.

## Module 6: Repeat the last response by using “AMAZON.RepeatIntent” - a built-in intent provided by Amazon
In this module, you will add a built-in intent - AMAZON.RepeatIntent. It is one of the many standard built-in intents that lets the user request to repeat the last action. So, our skill will be able to respond back to the utterance “can you repeat that”, “what was that again” etc.

[![](http://ajotwani.s3.amazonaws.com/ask-workshop/images/1.png)](/Module%201%20-%20Hello%20Vegas!/README.md)

---

### Extra Credits

1. [Add Memory to your skill](https://developer.amazon.com/alexa-skills-kit/courses/cake-walk-5)
2. **Add SSML, Sound Effects, and Amazon Polly:** In every interaction of your skill, you will create a more immersive experience for your customer by integrating SSML, Sound Effects, and Amazon Polly to the voice responses.
3. **Make Money with In-Skill Purchasing**: Your customer will be able to purchase premium content within your skill, making their experience more delightful and surprising. Here's a ["Hello World" code sample](https://github.com/alexa/skill-sample-nodejs-premium-hello-world) to get started with.

---

### Community Resources
- [Cake Walk Course](https://developer.amazon.com/alexa-skills-kit/courses/cake-walk-1)
- [Amazon Developer Forums](https://forums.developer.amazon.com/spaces/23/Alexa+Skills+Kit.html)
- [Alexa Skills - User Voice](https://alexa.uservoice.com)

---

### License
This library is licensed under the Amazon Software License