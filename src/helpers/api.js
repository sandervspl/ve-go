class ApiConfig {
  domain = '192.168.2.8';
  port = 8080;
  version = 'v1';
  url = `http://${this.domain}:${this.port}/api/${this.version}`;
}
export const apiConfig = new ApiConfig();
