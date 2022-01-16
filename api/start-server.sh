node --version

echo "ls"
ls -l

echo "ls api"
ls -l api

echo "SENTRY_DSN: ${SENTRY_DSN}"

sed -i "s|COMPANY_NAME_SHORT_HEADER|${COMPANY_NAME_SHORT_HEADER}|g" ./api/**/*.js
sed -i "s|COMPANY_NAME_SHORT_HEADER|${COMPANY_NAME_SHORT_HEADER}|g" ./api/**/*.js.map

redis-server 2>&1&

node ./api/main.js
