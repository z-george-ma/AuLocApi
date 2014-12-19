FROM dockerfile/nodejs
MAINTAINER z.george.ma@gmail.com

ENV NODE_ENV production
ENV DEST_DIR /api/
ADD . $DEST_DIR
WORKDIR $DEST_DIR
RUN ["npm", "install", "--production"] 
ENTRYPOINT ["node", "server"]
EXPOSE 80
