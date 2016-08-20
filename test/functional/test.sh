# via console
# aws lambda invoke --invocation-type RequestResponse --function-name LambdaFunctionOverHttps --region eu-central-1 --payload file:///Users/wim/Code/bubobox/slack-pomodoro-bot/test/functional/payloads/echo.txt outputfile.txt

# via endpoint
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
curl -X POST -d @$DIR/payloads/echo.txt "https://fburhm5u0j.execute-api.eu-central-1.amazonaws.com/test/test"
