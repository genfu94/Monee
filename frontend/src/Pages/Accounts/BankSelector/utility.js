import urlJoin from "url-join";
import { POST_request, GET_request } from "../../../Utils/network";

export function bankConnect(institution_info, username) {
  let institution = {
    id: institution_info["value"],
    name: institution_info["label"],
  };

  const endpoint = urlJoin(
    process.env.REACT_APP_BACKEND_ENDPOINT,
    "bank_connect"
  );
  POST_request(endpoint, { username: username }, institution).then(
    (data) => {
      let bank_connection_link = data.link;
      window.location.replace(bank_connection_link);
    }
  );
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
