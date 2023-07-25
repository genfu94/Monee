import urlJoin from "url-join";

export async function synchronizeAndFetchAccounts() {
  const endpoint = urlJoin(
    process.env.REACT_APP_BACKEND_ENDPOINT,
    "synchronize_account"
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
