import urlJoin from "url-join";
import { POST_request, GET_request } from "../utils/network.js";

export async function authenticate(username, password) {
  const endpoint = urlJoin(process.env.REACT_APP_BACKEND_ENDPOINT, "token");

  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  return await fetch(endpoint, { method: "POST", body: formData }).then(
    (response) => {
      if (response.status !== 200) throw new Error(response.status);
      return response.json();
    }
  );
  //return await POST_request(endpoint, null, null, null, formData);
}

export async function verifyAuthentication() {
  const endpoint = urlJoin(
    process.env.REACT_APP_BACKEND_ENDPOINT,
    "check_authentication"
  );

  return await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((response) => {
    if (response.status !== 200) throw new Error(response.status);
    return response.json();
  });
}

export async function register(username, password) {
  const endpoint = urlJoin(process.env.REACT_APP_BACKEND_ENDPOINT, "signup");

  return await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  }).then((response) => {
    if (response.status !== 200) throw new Error(response.status);
    return response.json();
  });
}
