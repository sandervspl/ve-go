class ApiConfig {
  port = 8080;
  // domain = process.env.NODE_ENV === 'production' ? 'https://vegan-go-server.herokuapp.com' : `http://192.168.2.15:${port}`;
  domain = 'https://vegan-go-server.herokuapp.com';
  version = 'v1';
  url = `${this.domain}/api/${this.version}`;
}
export const apiConfig = new ApiConfig();
