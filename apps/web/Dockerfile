FROM alpine:latest

RUN apk add --update nodejs npm
RUN npm install --global yarn

COPY [".", "/usr/src"]

WORKDIR "/usr/src"

RUN yarn

EXPOSE 3000

CMD ["yarn", "start"]