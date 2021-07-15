startAPI() {
  echo "starting api..."
  node ./api/main.js
  # return $(node ./api/main.js)
}

startAPI

# while [ $? ]
# do
#   echo "API existed with an error"
#   echo "Re-starting API in 5 seconds..."
#   sleep 5s
#   startAPI
# done

