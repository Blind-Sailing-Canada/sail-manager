node --version

echo "ls"
ls -l

echo "ls api"
ls -l api

echo "SENTRY_DSN: ${SENTRY_DSN_BACKEND}"

sed -i "s|COMPANY_NAME_SHORT_HEADER|${COMPANY_NAME_SHORT_HEADER}|g" ./api/**/*.js
sed -i "s|COMPANY_NAME_SHORT_HEADER|${COMPANY_NAME_SHORT_HEADER}|g" ./api/**/*.js.map

node ./api/main.js
