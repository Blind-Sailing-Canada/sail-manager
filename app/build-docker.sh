# exit when any command fails
set -e

# BUILD APP
echo "=========BUILDING APP========="
cd ./app_src
yarn -silent install --frozen-lockfile
yarn build
mv ./start-server.sh ./app/start-server.sh
mv ./app ../app
cd ../
rm -rf ./app_src
yarn cache clean
