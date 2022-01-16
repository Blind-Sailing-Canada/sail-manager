# exit when any command fails
set -e

# BUILD API
echo "=========BUILDING API========="
cd ./api_src
yarn -silent install --frozen-lockfile
yarn build
mv ./dist ./api 
cp ./package.json ./api/package.json
cp ./yarn.lock ./api/yarn.lock
cp ./yarn.lock ./api/yarn.lock
cp ./start-server.sh ./api/start-server.sh
mv ./api ../api
cd ../api
yarn --prod -silent install --frozen-lockfile
cd ../
rm -rf ./api_src
yarn cache clean