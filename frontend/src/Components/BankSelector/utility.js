export function bankConnect(institution_info, username) {
  let institution = {
    id: institution_info["value"],
    name: institution_info["label"],
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(institution),
  };
  fetch(
    `http://localhost:8000/bank_connect?username=${username}`,
    requestOptions
  )
    .then((res) => res.json())
    .then((data) => {
      let bank_connection_link = data.link;
      window.location.replace(bank_connection_link);
    });
}

export function onCountrySelect(selected_country) {
  let available_institutions = [];

  fetch(
    `http://localhost:8000/get_available_institutions?country_code=${selected_country}`
  )
    .then((res) => res.json())
    .then((data) => {
      data.forEach((institution) => {
        available_institutions.push({
          value: institution["id"],
          label: institution["name"],
        });
      });
    });
  
  return available_institutions;
}