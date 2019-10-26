FROM node:8 as react-build
WORKDIR /app
COPY . ./
ARG BACKEND_URL
ENV REACT_APP_BACKEND_URL foobar
RUN yarn
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]