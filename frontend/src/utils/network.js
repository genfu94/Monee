const objectMap = (obj, fn) =>
  Object.entries(obj).map(([k, v], i) => fn(k, v, i));

async function _REST_call(
  endpoint,
  method,
  params = [],
  headers = null,
  json = null,
  form = null,
) {
  let requestOptions = {
    method: method,
  };

  if(headers !== null) requestOptions['headers'] = headers;

  if(json !== null) {
    requestOptions['body'] = JSON.stringify(json)
  } else if (form !== null) {
    requestOptions['body'] = form
  }

  const url = endpoint + (params !== [] ? _build_params_string(params) : "");
  return await fetch(url, requestOptions).then((response) => {
    if (response.status !== 200) throw new Error(response.status);
    return response.json();
  });
}

function _build_params_string(params) {
  const paramString = objectMap(params, (k, v) => `${k}=${v}`);
  return "?" + paramString.join("&");
}

export async function GET_request(endpoint, params = [], headers = null) {
  return _REST_call(endpoint, "GET", params, headers, null);
}

export async function POST_request(endpoint, params, headers = null, body = null, form = null) {
  return _REST_call(endpoint, "POST", params, headers, body, form);
}
