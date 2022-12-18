FROM alpine:latest as build
ARG REACT_APP_ENV_MODE

RUN apk add --update nodejs npm
RUN npm install --global yarn

COPY [".", "/usr/src"]

WORKDIR "/usr/src"

RUN yarn
RUN yarn build

FROM nginx:1.23.1-alpine
EXPOSE 80
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]