const objectMap = (obj, fn) => Object.entries(obj).map(([k, v], i) => fn(k, v, i));

async function _REST_call(endpoint, method, params=[], body=null) {
  const requestOptions = {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: body === null ? null : JSON.stringify(body)
  };

  return fetch(endpoint + _build_params_string(params), requestOptions);
}

function _build_params_string(params) {
  const paramString = objectMap(params, (k, v) => `${k}=${v}`)
  console.log(paramString);
  return "?" + paramString.join('&');
}

export async function GET_request(endpoint, params) {
  return _REST_call(endpoint, "GET", params);
}

export async function POST_request(endpoint, params, body) {
  return _REST_call(endpoint, "POST", params, body);
}