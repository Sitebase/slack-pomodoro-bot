# Slack Pomodoro Bot

## Deploy
```
aws lambda create-function --region eu-central-1 --function-name LambdaFunctionOverHttps --zip-file fileb:///Users/wim/Code/bubobox/slack-pomodoro-bot/dist.zip --role arn:aws:iam::244654009431:role/service-role/slack-pomodoro-bot --handler LambdaFunctionOverHttps.handler --runtime nodejs4.3
```

## Resources
* [Using AWS Lambda with Amazon API Gateway](http://docs.aws.amazon.com/lambda/latest/dg/with-on-demand-https.html)
* [API Gateway step by step](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-step-by-step.html)
