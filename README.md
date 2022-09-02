# Expense Tracker  

A application for user can sign in and make your personal expense tracker that you can record all your expense.

## Features  
* Login and register for your personal tracker.  
* add new record with details , category , amount and your local date time.  
* edit your record while you set up wrong messages with above options  
* partial category selection can let you filter your records with category  
* delete your record that you don't needed anymore.  
## Screen  
![image](https://github.com/eaz73727/espense-tracker/blob/main/tracker.jpg)
## Getting Started  
1. clone  
 `git clone https://github.com/eaz73727/espense-tracker.git`   
2. install modules  
 `npm install`  
3. check .env.example for setting up your global var  
4. run the seeder to add the basic example user and records  
 `npm run seed`  
5. run the server  
 `npm run start`  
### seeder intro  
* 5 records with 5 standard categories
* login email address: `root@example.com`  
* login password: `12345678`  
## built with ...  
* Runtime:node.js@16.17.0  
* Framework:express@4.18.1  
* Render: express-handlebars@6.0.6  
* Database: mongoose@6.5.3  
* More modules in package.json  
