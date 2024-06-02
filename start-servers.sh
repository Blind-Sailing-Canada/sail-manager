echo "node version $(node --version)"
echo "SENTRY_DSN: ${SENTRY_DSN}"

echo
echo

echo "ls root dir"
ls -a -l

apps="app api"

for app in $apps
do
  echo
  echo

  echo "ls $app"
  ls $app -a -l

  echo
  echo
  echo "replacing ${app}"

  find ./${app} -type f -not \( -path '*/node_modules/*' -o -path '*/src/*' \) \( -name "*.js.map" -o -name "*.html" \) -print0 | xargs -0 sed -i "s|SENTRY_DSN|${SENTRY_DSN}|g"
  find ./${app} -type f -not \( -path '*/node_modules/*' -o -path '*/src/*' \) \( -name "*.js" -o -name "*.js.map" -o -name "*.html" \) -print0 | xargs -0 sed -i "s|COMPANY_NAME_COPYRIGHT|${COMPANY_NAME_COPYRIGHT}|g"
  find ./${app} -type f -not \( -path '*/node_modules/*' -o -path '*/src/*' \) \( -name "*.js" -o -name "*.js.map" -o -name "*.html" \) -print0 | xargs -0 sed -i "s|WEBSITE_TITLE|${WEBSITE_TITLE}|g"
  find ./${app} -type f -not \( -path '*/node_modules/*' -o -path '*/src/*' \) \( -name "*.js" -o -name "*.js.map" -o -name "*.html" \) -print0 | xargs -0 sed -i "s|COMPANY_NAME_HEADER|${COMPANY_NAME_HEADER}|g"
  find ./${app} -type f -not \( -path '*/node_modules/*' -o -path '*/src/*' \) \( -name "*.js" -o -name "*.js.map" -o -name "*.html" \) -print0 | xargs -0 sed -i "s|COMPANY_NAME_SHORT_HEADER|${COMPANY_NAME_SHORT_HEADER}|g"
  find ./${app} -type f -not \( -path '*/node_modules/*' -o -path '*/src/*' \) \( -name "*.js" -o -name "*.js.map" -o -name "*.html" \) -print0 | xargs -0 sed -i "s|SKIPPER_GROUP_EMAIL|${GOOGLE_GROUP_SKIPPERS}|g"
  find ./${app} -type f -not \( -path '*/node_modules/*' -o -path '*/src/*' \) \( -name "*.js" -o -name "*.js.map" -o -name "*.html" \) -print0 | xargs -0 sed -i "s|MEMBERS_GROUP_EMAIL|${GOOGLE_GROUP_MEMBERS}|g"
  find ./${app} -type f -not \( -path '*/node_modules/*' -o -path '*/src/*' \) \( -name "*.js" -o -name "*.js.map" -o -name "*.html" \) -print0 | xargs -0 sed -i "s|CREW_GROUP_EMAIL|${GOOGLE_GROUP_CREW}|g"
  find ./${app} -type f -not \( -path '*/node_modules/*' -o -path '*/src/*' \) \( -name "*.js" -o -name "*.js.map" -o -name "*.html" \) -print0 | xargs -0 sed -i "s|CONTACT_US_EMAIL|${CONTACT_US_EMAIL}|g"
done

chmod +x ./start-api-server.sh
chmod +x ./start-app-server.sh

# redis-server 2>&1&
redis-server --daemonize yes

./start-api-server.sh 2>&1&

./start-app-server.sh
