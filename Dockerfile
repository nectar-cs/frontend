FROM node:8 as react-build
WORKDIR /app
COPY . ./
ARG REACT_APP_REVISION
ENV REACT_APP_REVISION $REACT_APP_REVISION

ARG REACT_APP_SENTRY_DSN
ENV REACT_APP_SENTRY_DSN $REACT_APP_SENTRY_DSN

ARG REACT_APP_MIXPANEL_TOKEN
ENV REACT_APP_MIXPANEL_TOKEN $REACT_APP_MIXPANEL_TOKEN

ENV REACT_APP_BACKEND_URL https://mosaic-backend-stage.herokuapp.com
RUN yarn
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]