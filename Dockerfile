FROM node

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN npm i -g pnpm && \
    pnpm i -r

EXPOSE 8080

CMD [ "pnpm", "dev" ]