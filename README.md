stamplay-hackernews
===================

**This project is built on the [Stamplay](https://stamplay.com) platform, with few lines of [jQuery](http://jquery.com) to show how to build your own clone of hacker news in tenth of minutes.**

You can test it anytime simply creating a new project on Stamplay and uploading with our [CLI tool](https://github.com/Stamplay/stamplay-cli). 

Feel free to implement more cool features (see the last paragraph for ideas), contribute to this repo or clone it to use it by your own scopes. For any question drop an email to [giuliano.iacobelli@stamplay.com](mailto:giuliano.iacobelli@stamplay.com)

-----------------------
## Hacker News clone

This is a demo of what you can achieve with [Stamplay](https://stamplay.com).

It's somewhat of a clone of Hacker News. [View demo](https://hackernews.stamplayapp.com/)

Currently, in order to show how to leverage Stamplay APIs and keep it simple we used our [javascript sdk] (https://github.com/Stamplay/stamplay-js-sdk) to implement the client side logic.

* Login with Facebook
* Publish a URL/Post
* Upvote them
* Comment on them
* Gain karma points
* See what other user posted
* Search Posts

Best of all, it has no server code it has barely some Javascript line. Prepare to be amazed.

-----------------------
# Anatomy

HNclone is built around the following apis (components) of Stamplay

* [Users](https://stamplay.com/docs#user)
* [Gamification](https://stamplay.com/docs#challenge)
* [Custom Objects](https://stamplay.com/docs#customobject)
* [Email](https://stamplay.com/docs#email)
* Mailchimp


## Requirements

Go to [your account](https://editor.stamplay.com/apps) and create a new app.

Other required services :

* A [Facebook App](http://developers.facebook.com/apps) to setup Facebook Login auth

Optional services :

* [Google Analytics](http://google.com/analytics)
* [Mailchimp](http://mailchimp.com)

## Configuring the components

After creating a new app on [Stamplay](https://editor.stamplay.com) let's start by picking the component we want to use in our app that are: **User**, **Email**, **Gamification**, **Custom Objects**.

Lets see one-by-one how they are configured:

### User
The app leverages Facebook Login to provide an easy login to its users. In order to activate yours you need to get an APPID and APPSecret on [Facebook Developer's portal](http://developers.facebook.com/apps), create an app and add stamplayapp.com as authorized domain as you can see in the pic below. 

![Facebook app settings](https://blog.stamplay.com/wp-content/uploads/2014/07/Schermata-2014-07-22-alle-17.43.24.png "Facebook app settings")

now you have the data to configure Facebook Login on your app's user module. Go back on Stamplay, select the user component, add Facebook as signup service and then cut and paste the App ID and App Secret and click save.


### Custom Object
For our Hacker News clone we use this module to represent the **Post** that users can publish on Hacker news. Our posts will have a title, url, description and other two attributes as showed in the picture below. 

After setting up this Stamplay will instantly expose Restful APIs for our newly created Post resource on the following endpoint ```https://APPID.stamplayapp.com/api/cobject/v1/post```

![Custom Object settings](https://blog.stamplay.com/wp-content/uploads/2014/07/Schermata-2014-07-22-alle-19.38.29.png)

Moreover we'll use a ```contact``` custom object with ```email``` and ```message``` attributes as string.

### Gamification
User activity on Hacker News is rewarded with Karma points, this component empower you to add gamification mechanics by defining challenges and achievements in your app. In this way we will be able to assign points to our users as soon as they post or comment new Posts on our Hacker News clone without having to write a single server side line of code.

Gamification's challenges can have one or more level that are unlocked when the user earns enough points. Every level has a graphic representation for both locked and unlocked state. Here we can see our one and only "superguru" level for the karma point challenge that user will unlock after they earn 900 points.

![Gamification settings](https://blog.stamplay.com/wp-content/uploads/2014/07/Schermata-2014-07-22-alle-19.49.13.png)

### Email
This component doesn't need any setup, couldn't be easier than that ;)


### Mailchimp (optional)
To push email addresses of app's users to a Mailchimp list you only need to connect your account. Just click the "Connect" button and authorize Stamplay in interacting with your Mailchimp data.


-----------------------


## Creating the server side logic with Tasks

Now let's add the tasks that will define the server side of our app. For our app we want that:

###When a new user signup, we send him a welcome email
Trigger : User - On Signup

Action: Email - Send Email

**Send Email configuration**

	To: {{user.email}}  // this will be automatically replaced with user's email
	From: "welcome@stamplaynews.com"
	From name: "Stamplay HN"
	Subject: "Welcome!"
	Body: "Hi {{user.displayName}}! Welcome to this clone of Hacker News built with <a href="https://stamplay.com">Stamplay</a>"
	


###When a new user signup, he automatically join the karma points challenge
Trigger : User - On Signup

Action: Gamification - Join Challenge

**Join Challenge configuration**

	challenge: hnkarma

###When a user publish a new post, he earns 10 points
Trigger : Custom Object - Create (new object created)

Action: Gamification - Add Points


**Create configuration**

	custom object: post 

**Add Points configuration**

	challenge: hnkarma
	points: 10


###When a user fills the contact form, we receive an email with the form's content

Trigger : Form - Submit

Action: Email - Send Email

**Form submit configuration**

	Form: contact

**Send Email configuration**

	to: address@email.com
	from: {{entry.data.email}}
	name: {{user.displayName}}
	Subject: "New Message from Hacker News clone"
	Body: {{entry.data.message}}


###When a new user signup, adds him on a Mailchimp list (optional)
Trigger : User - On Signup

Action: Mailchimp - Subscribe to a List

**Subscribe to a List configuration**

	list: [your list name]
	email: {{user.email}}	



This should be the final result of the configured tasks


![Task overview](https://blog.stamplay.com/wp-content/uploads/2014/07/Schermata-2014-07-22-alle-22.28.44.png)


_______________________________


## Building the frontend

###Pages

Time to move to the frontend, everything happens in few pages with the following scopes:

##### /index.html
The home page where users can see all the post published sorted by upvotes received, and logged users can vote the best ones.

##### /submit
A page to submit the a new post

##### /item
A page to see the detail of a post, read and post comments

##### /contact
A page that contains the contact form to let our users reach out to us without leaving the website.

###Client side logic 

In [main.js](https://github.com/Stamplay/stamplay-hackernews/blob/freeAssets/js/main.js) you can find the frontend logic written with few lines of javascript and using jQuery. In the [utils.js] (https://github.com/Stamplay/stamplay-hackernews/blob/freeAssets/js/utils.js) file there are some support methods for formatting dates and retrieving url parameters.



-----------------------
# Cloning

First, clone this repository :

    git clone git@github.com:Stamplay/stamplay-hackernews.git
    
Or download it as a zip file
	
	https://github.com/Stamplay/stamplay-hackernews/archive/master.zip 

Then you need to upload the frontend files in your app by using the [CLI tool](https://github.com/Stamplay/stamplay-cli):

```js
cd your/path/to/stamplay-hackenews
stamplay init
/*
 * You will need to insert your appId and your API key
 */
stamplay deploy
```

-----------------------
# Next steps

Here are a few ideas for further improvement :

* Use [Pusher](http://pusher.com) component to send realtime notification when a new post is created
* _Your idea here… ?_

Again, for any questions drop an email to [giuliano.iacobelli@stamplay.com](mailto:giuliano.iacobelli@stamplay.com) :)

Ciao!
