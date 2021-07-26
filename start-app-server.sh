startAPP() {
  echo "starting app..."
  echo 'CURRENT WORKING DIRECTORY'
  pwd
  ls -a -l
  return $(node ./app/server/server.js)
}

startAPP

while [ $? ]
do
  echo "APP existed with an error"
  echo "Re-starting APP in 5 seconds..."
  sleep 5s
  startAPP
done

