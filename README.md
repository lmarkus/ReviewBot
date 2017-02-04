reviewMe
===========

GitHub PR Review Helper


## Config
### GitHub

  * `token`: GitHub access token. Required for posting comments to a pull request. The access token must created with  `repo` scope. [Documentation](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)
  * `secret`: (Optional) GitHub WebHook secret for validating incoming messages
 
 Additional options can be specified, and are passed onto the [GitHub Hooks Module](https://github.com/nlf/node-github-hook). Review their documentation for more info.
 
 
