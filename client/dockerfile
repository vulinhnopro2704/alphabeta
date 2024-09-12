FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output from the build
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

# Set the correct permission for prerender cache
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000

# Use the correct entry point from standalone build
CMD HOSTNAME="0.0.0.0" node server.js
