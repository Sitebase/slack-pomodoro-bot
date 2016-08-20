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
cp -r src/* dist/$1/
cp package.json dist/$1/
mv dist/$1/$1.js dist/$1/index.js
cd dist/$1/
zip -r ../$1.zip *
cd ../..

aws lambda update-function-code --region eu-central-1 --function-name $1 --zip-file fileb://dist/$1.zip
