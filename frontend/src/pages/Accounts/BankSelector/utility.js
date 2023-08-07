import urlJoin from "url-join";
import { GET_request } from "../../../utils/network";

export async function bankConnect(institution_info) {
  let institution = {
    id: institution_info["value"],
    name: institution_info["label"],
  };

  const endpoint = urlJoin(
    process.env.REACT_APP_BACKEND_ENDPOINT,
    "bank_connect"
  );

  return await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(institution),
  }).then(async (response) => {
    if (response.status !== 200) throw new Error(response.status);
    const bank_link = await response.json();
    console.log(bank_link);
    let bank_connection_link = bank_link.link;
    window.location.replace(bank_connection_link);
  });
}

export function onCountrySelect(selected_country) {
  let available_institutions = [];

  const endpoint = urlJoin(
    process.env.REACT_APP_BACKEND_ENDPOINT,
    "get_available_institutions"
  );
  GET_request(endpoint, { country_code: selected_country }).then((data) => {
    data.forEach((institution) => {
      available_institutions.push({
        value: institution["id"],
        label: institution["name"],
      });
    });
  });

  return available_institutions;
}
