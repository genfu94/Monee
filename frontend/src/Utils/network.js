async function _REST_call(endpoint, method, body=null) {
  const requestOptions = {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: body === null ? null : JSON.stringify(body)
  };

  return fetch(endpoint, requestOptions);
}

export async function GET_request(endpoint) {
  return _REST_call(endpoint, "GET");
}

export async function POST_request(endpoint, body) {
  return _REST_call(endpoint, "POST", body);
}