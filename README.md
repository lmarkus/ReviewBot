ReviewBot 9000
===========

GitHub PR Review Helper

## Setup

GH_TOKEN: https://help.github.com/articles/creating-an-access-token-for-command-line-use/
GH_SECRET: https://repl.it/F75H/0
SLACK_TOKEN: https://get.slack.help/hc/en-us/articles/215770388-Create-and-regenerate-API-tokens


## Deployment
This app needs to be deployed somewhere to run.

If you are an enterprise user, you'll probably need to deploy this behind your firewall. (Listener Ports and Hosts are fully configurable)

If you don't have any constraints, I highly recommend you deploy this on Heroku:

### Heroku Setup
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


## Config
### GitHub

  * `token`: GitHub access token. Required for posting comments to a pull request. The access token must created with  `repo` scope. [Documentation](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)
  * `secret`: (Optional) GitHub WebHook secret for validating incoming messages
 
 Additional options can be specified, and are passed onto the [GitHub Hooks Module](https://github.com/nlf/node-github-hook). Review their documentation for more info.
 
 
