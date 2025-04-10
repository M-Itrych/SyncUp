SOURCE_DIR="./"
REMOTE_DIR="/var/www/yapper"
HOST="root@halina305.mikrus.xyz"
PORT="10305"

ssh -p $PORT $HOST "mkdir -p $REMOTE_DIR"
tar -czf - "$SOURCE_DIR" | ssh -p $PORT $HOST "tar -xzf - -C $REMOTE_DIR --strip-components=1 --no-same-owner"


sleep 10