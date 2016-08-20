if [ -z "$1" ]
  then
    echo "No function name provided"
    exit
fi

# clean
rm -f dist.zip
rm -f src/package.json
rm -rf dist/*

# build
cp package.json src
mkdir -p dist/$1/
cp src/* dist/$1/
# zip -r ../dist/$1.zip *

# deploy
# aws lambda create-function --region eu-central-1 --function-name LambdaFunctionOverHttps --zip-file fileb:///Users/wim/Code/bubobox/slack-pomodoro-bot/dist.zip --role arn:aws:iam::244654009431:role/service-role/slack-pomodoro-bot --handler LambdaFunctionOverHttps.handler --runtime nodejs4.3

# aws lambda update-function-code --region eu-central-1 --function-name slackPomodoroBotInfo --zip-file fileb://dist.zip
