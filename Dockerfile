# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app

COPY .yarn .yarn
COPY src src
COPY .yarnrc.yml package.json tsconfig.json next.config.js yarn.lock ./

RUN yarn && yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

RUN yarn

USER nextjs

EXPOSE $PORT

ENTRYPOINT ["yarn", "start"]