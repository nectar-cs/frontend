export const defaultHeaders = [
  "Content-Type: application/json"
].join("\n");

export const defaultBody = JSON.stringify({
  data: {
    type: 'test payload'
  }
});