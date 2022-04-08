FROM node:alpine as build

WORKDIR /opt/fanfou

COPY . .

RUN npm install && npm run build

FROM alpine

COPY --from=build /opt/fanfou/dist/fanmark /bin/fanmark

ENTRYPOINT [ "doumark" ]