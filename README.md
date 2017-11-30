ReviewBot 9000
===========
![Build Status](https://travis-ci.org/lmarkus/ReviewBot.svg?branch=master)

When you have a large group of people working on a project with high velocity, 
sometimes it's hard to coordinate reviewers for Pull Requests. This application
keeps track of the maintainers of a repo, and how many reviews each person has done.

When a new pull request comes in, the app will pick a (configurable) number of people
from the reviewer pool, in a fair manner.  The selected people will be assigned to review
the PR, and they will also (optionally) be notified via Slack.

## Setup

You will need to obtain the following three things to get started:

* GitHub Personal Access Token: (*GH_TOKEN*) This will be used by the app to read from, and post comments to your reapo. The access token
should have `repo` scope. See [How to obtain an access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)
* GitHub Hook Secret: (*GH_SECRET*) *Optional*. If provided this will be used by GitHub to sign payloads. The app can then verify authenticiy.
Here's a [quick example](https://repl.it/F75H/0) of how to generate a good, random secret.
* Slack API token: (*SLACK_TOKEN*) Used to post assignment announcements to a Slack channel. See [Slack's API docs](https://get.slack.help/hc/en-us/articles/215770388-Create-and-regenerate-API-tokens)

## Deployment
This app needs to be deployed somewhere to run, and GitHub webhooks must be properly configured.
If you don't have any constraints, I highly recommend you deploy this on Heroku.
Also recommended, deploy the service first, and then set up your hooks.

### Service Deployment
#### Heroku Setup
* Clone this repo `$ git clone https://github.com/lmarkus/ReviewBot/ && cd ReviewBot`
* Follow the [Setup](#Setup) section above
* Create a [free heroku account](https://signup.heroku.com/) (If you've never worked with Heroku before, you should follow their [NodeJS tutorial](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) first)
* Download the [Heroku CLI tool](https://devcenter.heroku.com/articles/heroku-cli)
* Login through the CLI tool `$ heroku login` (Use your credentials)
* Spin up a new app `$ heroku create`
* Push the app to Heroku `$ git push heroku master`
* Add your private configuration to the app: 
```bash
 heroku config:set GH_TOKEN=<your access token>
 heroku config:set GH_SECRET=<your secret>
 heroku config:set SLACK_TOKEN=<your slack api token>
```
* Launch the app! `$ heroku ps:scale web=1` (Confirm that it works via `$ heroku open`)
**NOTE:** Heroku routes all traffic (NAT) through port 80 

#### Custom setup
If you are an enterprise user, you'll probably need to deploy this behind your firewall.
* Clone this repo `$ git clone https://github.com/lmarkus/ReviewBot/ && cd ReviewBot`
* Install dependencies: `$ npm install`
* Set the environment variables (`GH_TOKEN`, `GH_SECRET`, `SLACK_TOKEN`) (Alternatively, you can directly set them in `./config/development.json` if you're just testing)
* Launch the app: `npm start` (or, `node server.js`)
* You'll probably want to look into writing a [startup script](https://blog.jalada.co.uk/simple-upstart-script-to-keep-a-node-process-alive/), or [forever](https://www.npmjs.com/package/forever) to ensure your app is always up and running

### GitHub Setup
* Add a [new GitHub WebHook](https://developer.github.com/webhooks/creating/)
* The default path is `http[s]://<your service URL>:<port>/hooks`
* Your WebHook needs to push specific events: `Pull Request` and `Comments`
* Don't forget to set up your `secret` if your service is expecting it.
* Add a `MAINTAINERS` file at the root of your repo. (See this [example](test/fixtures/MAINTAINERS) for formatting). This file lets the review bot know who's availabale for reviewing a PR


## Configuration

This is a KrakenJS app. you can read more about the base configuration [here](http://krakenjs.com/index.html#configuration).
The important thing you need to know right now, is that the configuration is environment-aware.
If you have `NODE_ENV` set to production, it will exclusively use `.config/config.json` otherwise, it will merge `.config/config.json` with `.config/development.json`.
This allows you the flexibility to test locally  with ease.

 Within either configuration file, look for the `app` section.
 Below are the default values:
 
 ```json  
  "app": {
            "github": {
                "api": {
                    "token": "env:GH_TOKEN",
                    "protocol": "https"
                },
                "hooks": {
                    "host": "",
                    "path": "/hooks"
                }
            },
            "slack": {
                "token": "env:SLACK_TOKEN",
                "notifyChannel": "general"
            },
            "reviewers": 2
        }
```
 
 You can choose to save the access tokens directly in the configuration file for convenience, but this is not a good practice
 
 The **api** section is passed on to the underlying [Node-GitHub Module](https://github.com/mikedeboer/node-github)
 
 The **hooks** section is passed on to the underlying [GitHubHook Module](https://github.com/nlf/node-github-hook) 
 
 ( You can read their respective docs for more info on available options.
   They will work fin out of the box for GitHub.com integrations, but you may need to tweak them a bit for custom and
   GitHub Enterprise settings.)
 
 The **slack** section just needs the access token, and the channel in which to post notifications (The bot *must* be invited into that channel)
 
 **reviewers** specifies how many people are assigned to a pull request.
 

  

