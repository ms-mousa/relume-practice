# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.16.0
FROM node:${NODE_VERSION}-slim as base
LABEL fly_launch_runtime="AdonisJS"
# AdonisJS app lives here
WORKDIR /app

# Throw-away build stage to reduce size of final image
FROM base as dependencies
ARG PNPM_VERSION=8.6.3
RUN npm install -g pnpm@$PNPM_VERSION

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential 

# Install node modules we still need dev deps
COPY --link ./package.json ./
COPY --link pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false
COPY . .

# Build application
FROM dependencies as build
RUN node ace build --production

# Final stage for app image
FROM base as RUN
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/scripts /app/scripts
COPY --from=build /app/docker-entrypoint.js /app/docker-entrypoint.js

# Install prod deps only
RUN pnpm install --prod

RUN mkdir -p /app/tmp/uploads
VOLUME /app/tmp/uploads
# Setup sqlite3 on a separate volume
RUN mkdir -p /data
VOLUME /data
# ENV DATABASE_URL="file:///data/sqlite.db"

# Entrypoint sets up the container.
ENTRYPOINT [ "/app/docker-entrypoint.js" ]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
ENV NODE_ENV=production
ENV HOST="0.0.0.0"
ENV PORT="3000"
CMD [ "node", "/app/build/server.js" ]
