# Lyra Liquidation Alerts Avalon _/

###  *Currently in early development and NOT ready for use.*

A Telegram & Discord bot providing liquidation alerts via Telegram & Discord. Traders can sign up and receive notifications about trading activity, most significantly liquidations. Since trades are time critical, this feature allows traders to quickly react to their own trades or trades from another trader they follow.


### Goal

> To improve trader experience by pushing important notifications about an individual’s trading activity.

### MVP

* Subscribe to orders (your own and other users) via Telegram & Discord. 
* Get liquidation warnings (price is within certain % of liquidation price) - Customisable 
* Get alerts for significant price movements (spot price / option values changed by certain %) - Customisable


## Getting Starting

 1. Update ```.env.example ``` to ```.env``` and add your credentials
 2. Run ```npm install``` 
 3. Start by running:  ```ts-node src/index.ts``` 


## Using The Bot

...Instructions to be added here. 



## Tech Stack 

* Node.js
* TypeScript
* Lyra.js
* Telegraf.js
* FaunaDB

