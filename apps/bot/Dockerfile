FROM mhart/alpine-node:14

RUN apk add curl

COPY [".", "/usr/src"]

WORKDIR "/usr/src"

RUN yarn

ARG NODE_ENV

CMD if [ "$NODE_ENV" = "develop" ] ; then yarn run dev ; else yarn run start ; fi
