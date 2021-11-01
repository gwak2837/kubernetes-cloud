# Rebuild the source code only when needed
FROM node:16-alpine AS builder

WORKDIR /app

COPY .yarn .yarn
COPY src src
COPY .env.production .yarnrc.yml package.json tsconfig.json next.config.js yarn.lock ./

RUN yarn && yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY .yarn .yarn
COPY public public
COPY .yarnrc.yml package.json yarn.lock .env.production ./
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

RUN yarn

USER nextjs

EXPOSE $PORT

ENTRYPOINT ["yarn", "start"]