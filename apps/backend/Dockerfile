FROM alpine:latest
ARG NOTION_INTEGRATION_ID
ARG NOTION_INTEGRATION_SECRET
ARG PORT
ARG NODE_ENV

RUN apk add --update nodejs npm
RUN npm install --global yarn

COPY [".", "/usr/src"]
WORKDIR "/usr/src"

RUN yarn

EXPOSE ${PORT}

CMD if [ ${NODE_ENV} = "development" ] ; then yarn run dev ; else yarn run start PORT=${PORT}; fi