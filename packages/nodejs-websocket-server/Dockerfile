FROM node:18

WORKDIR /app

COPY . .

# Install prerequisites
# RUN apk --no-cache add curl


# # Install oura
RUN curl --silent --location https://git.io/JD2ix | \
    tar xz -C /tmp && mv /tmp/oura /usr/local/bin

# install application dependencies
RUN npm install

# Expose the port for UDP
EXPOSE 9001

CMD sh run.sh