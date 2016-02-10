# Nightlife Coordination App

Second dynamic web application from the Free Code Camp back end development certification.

### Objective: 
Build a full stack JavaScript app that is functionally similar to 
this: http://whatsgoinontonight.herokuapp.com/ and deploy it to Heroku.

### User stories: 

  - As an unauthenticated user, I can view all bars in my area.
  - As an authenticated user, I can add myself to a bar to indicate I am going there tonight.
  - As an authenticated user, I can remove myself from a bar if I no longer want to go there.
  - As an unauthenticated user, when I login I should not have to search again.

### Live Version:
https://d-night-life.herokuapp.com/

### Requirements:
- Node.js
- NPM
- Mongodb
- Bower
- Yelp API
- Google Maps

### Installation:

1.Install dependecies 

```sh
$ npm install
```

2.Create a .bowerrc file on the app root folder with the following info

```sh
{
    "directory" : "public/vendors"
}
```
3.Install vendor dependecies

```sh
$ bower install
```

4.Create a .env file on the app root folder with the following info

```sh
BASEURL=[main url of application]
MONGO_URI=[mongodb url]

FB_CLIENT_ID=[fb client id]
FB_CLIENT_SECRET=[fb client secret]

TWITTER_KEY=[twitter client id]
TWITTER_SECRET=[twitter secret]

GOOGLE_MAPS_KEY=[google maps key]

YELP_CONSUMER_KEY=[yelp consumer key]
YELP_CONSUMER_SECRET=[yelp consumer secret]
YELP_TOKEN=[yelp token]
YELP_TOKEN_SECRET=[yelp_token_secret]

```
### Run:

```sh
$ npm start
```