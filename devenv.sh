docker run -v /var/run/docker.sock:/run/docker.sock -v /usr/local/bin/docker:/bin/docker -v $(pwd):/project -it chainone/nodejs-mongodb-git /bin/bash
