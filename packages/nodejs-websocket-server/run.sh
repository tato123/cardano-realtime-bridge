echo "Starting oura daemon"
oura daemon --config daemon.toml &

echo "Starting ws bridge"
npm start

