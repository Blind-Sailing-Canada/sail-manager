node --version

echo "ls"
ls

echo "ls app"
ls app

echo "SENTRY_DSN: ${SENTRY_DSN}"

sed -i "s|SENTRY_DSN|${SENTRY_DSN}|g" ./app/*.js
sed -i "s|SENTRY_DSN|${SENTRY_DSN}|g" ./app/*.js.map
sed -i "s|SENTRY_DSN|${SENTRY_DSN}|g" ./app/*.html

sed -i "s|COMPANY_NAME_COPYRIGHT|${COMPANY_NAME_COPYRIGHT}|g" ./app/*.js
sed -i "s|COMPANY_NAME_COPYRIGHT|${COMPANY_NAME_COPYRIGHT}|g" ./app/*.js.map
sed -i "s|COMPANY_NAME_COPYRIGHT|${COMPANY_NAME_COPYRIGHT}|g" ./app/*.html

sed -i "s|WEBSITE_TITLE|${WEBSITE_TITLE}|g" ./app/*.js
sed -i "s|WEBSITE_TITLE|${WEBSITE_TITLE}|g" ./app/*.js.map
sed -i "s|WEBSITE_TITLE|${WEBSITE_TITLE}|g" ./app/*.html

sed -i "s|COMPANY_NAME_HEADER|${COMPANY_NAME_HEADER}|g" ./app/*.js
sed -i "s|COMPANY_NAME_HEADER|${COMPANY_NAME_HEADER}|g" ./app/*.js.map
sed -i "s|COMPANY_NAME_HEADER|${COMPANY_NAME_HEADER}|g" ./app/*.html

sed -i "s|COMPANY_NAME_SHORT_HEADER|${COMPANY_NAME_SHORT_HEADER}|g" ./app/*.js
sed -i "s|COMPANY_NAME_SHORT_HEADER|${COMPANY_NAME_SHORT_HEADER}|g" ./app/*.js.map
sed -i "s|COMPANY_NAME_SHORT_HEADER|${COMPANY_NAME_SHORT_HEADER}|g" ./app/*.html

sed -i "s|CONTACT_US_EMAIL|${CONTACT_US_EMAIL}|g" ./app/*.js
sed -i "s|CONTACT_US_EMAIL|${CONTACT_US_EMAIL}|g" ./app/*.js.map
sed -i "s|CONTACT_US_EMAIL|${CONTACT_US_EMAIL}|g" ./app/*.html

node ./app/server/server.js