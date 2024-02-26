FROM jitesoft/node-yarn:20-slim

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 5173

CMD [ "yarn", "dev" ]