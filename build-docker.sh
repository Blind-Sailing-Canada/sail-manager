# exit when any command fails
set -e

# BUILD APP
echo "=========BUILDING APP========="
export NODE_OPTIONS=--max_old_space_size=4096
mv ./app ./app_src
cd ./app_src
yarn -silent install --frozen-lockfile
yarn build:app
mv ./app ../app
cd ../
rm -rf ./app_src
yarn cache clean

# BUILD API
echo "=========BUILDING API========="
mv ./api ./api_src
cd ./api_src
yarn -silent install --frozen-lockfile
yarn build
mv ./dist ./api 
cp ./package.json ./api/package.json
cp ./yarn.lock ./api/yarn.lock
mv ./api ../api
cd ../api
yarn --prod -silent install --frozen-lockfile
cd ../
rm -rf ./api_src
yarn cache clean