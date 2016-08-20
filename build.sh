# clean
rm -f dist.zip
rm -f src/package.json

# build
cp package.json src
cd src
zip -r ../dist.zip *

# deploy
# aws lambda create-function --region eu-central-1 --function-name LambdaFunctionOverHttps --zip-file fileb:///Users/wim/Code/bubobox/slack-pomodoro-bot/dist.zip --role arn:aws:iam::244654009431:role/service-role/slack-pomodoro-bot --handler LambdaFunctionOverHttps.handler --runtime nodejs4.3

aws lambda update-function-code --region eu-central-1 --function-name LambdaFunctionOverHttps --zip-file fileb:///Users/wim/Code/bubobox/slack-pomodoro-bot/dist.zip
