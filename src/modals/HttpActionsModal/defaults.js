export const defaultHeaders = [
  "Content-Type: application/json"
].join("\n");

export const defaultBody = JSON.stringify({
  data: {
    type: 'test payload'
  }
}, null, 2);

export const sampleOut = "{\n" +
  "  \"env\": {\n" +
  "    \"PATH\": \"/usr/local/bundle/bin:/usr/local/bundle/gems/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\",\n" +
  "    \"HOSTNAME\": \"ruby-cluster-5ff5b7f7c4-lkhvv\",\n" +
  "    \"KUBERNETES_PORT_443_TCP_PORT\": \"443\",\n" +
  "    \"KUBERNETES_PORT_443_TCP_ADDR\": \"10.0.16.1\",\n" +
  "    \"RUBY_CLUSTER_PORT_80_TCP_PORT\": \"80\",\n" +
  "    \"NGINX_WORLD_PORT_80_TCP\": \"tcp://10.0.30.144:80\",\n" +
  "    \"KUBERNETES_SERVICE_PORT\": \"443\",\n" +
  "    \"KUBERNETES_PORT_443_TCP_PROTO\": \"tcp\",\n" +
  "    \"RUBY_CLUSTER_PORT_80_TCP_PROTO\": \"tcp\",\n" +
  "    \"RUBY_CLUSTER_PORT_80_TCP_ADDR\": \"10.0.20.109\",\n" +
  "    \"NGINX_WORLD_PORT\": \"tcp://10.0.30.144:80\",\n" +
  "    \"NGINX_WORLD_PORT_80_TCP_PROTO\": \"tcp\",\n" +
  "    \"RUBY_CLUSTER_SERVICE_PORT\": \"80\",\n" +
  "    \"RUBY_CLUSTER_PORT\": \"tcp://10.0.20.109:80\",\n" +
  "    \"NGINX_WORLD_PORT_80_TCP_PORT\": \"80\",\n" +
  "    \"KUBERNETES_PORT_443_TCP\": \"tcp://10.0.16.1:443\",\n" +
  "    \"RUBY_CLUSTER_SERVICE_HOST\": \"10.0.20.109\",\n" +
  "    \"KUBERNETES_SERVICE_HOST\": \"10.0.16.1\",\n" +
  "    \"KUBERNETES_SERVICE_PORT_HTTPS\": \"443\",\n" +
  "    \"KUBERNETES_PORT\": \"tcp://10.0.16.1:443\",\n" +
  "    \"RUBY_CLUSTER_PORT_80_TCP\": \"tcp://10.0.20.109:80\",\n" +
  "    \"NGINX_WORLD_SERVICE_HOST\": \"10.0.30.144\",\n" +
  "    \"NGINX_WORLD_SERVICE_PORT\": \"80\",\n" +
  "    \"NGINX_WORLD_PORT_80_TCP_ADDR\": \"10.0.30.144\",\n" +
  "    \"RUBY_MAJOR\": \"2.6\",\n" +
  "    \"RUBY_VERSION\": \"2.6.4\",\n" +
  "    \"RUBY_DOWNLOAD_SHA256\": \"df593cd4c017de19adf5d0154b8391bb057cef1b72ecdd4a8ee30d3235c65f09\",\n" +
  "    \"GEM_HOME\": \"/usr/local/bundle\",\n" +
  "    \"BUNDLE_PATH\": \"/usr/local/bundle\",\n" +
  "    \"BUNDLE_SILENCE_ROOT_WARNING\": \"1\",\n" +
  "    \"BUNDLE_APP_CONFIG\": \"/usr/local/bundle\",\n" +
  "    \"PORT\": \"80\",\n" +
  "    \"HOME\": \"/root\"\n" +
  "  }\n" +
  "}";