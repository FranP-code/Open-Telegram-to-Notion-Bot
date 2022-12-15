FROM ubuntu:latest

RUN apt-get upgrade && apt-get update
RUN apt install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - &&\
apt-get install -y nodejs
RUN npm install --global yarn

COPY [".", "/usr/src"]

WORKDIR "/usr/src"

RUN yarn

ARG NODE_ENV

CMD if [ "$NODE_ENV" = "development" ] ; then yarn run dev ; else yarn run start ; fi
