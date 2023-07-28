import React, { useState } from "react";

import { onCountrySelect } from "./utility";

const useBankSelector = () => {
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  const setInstitutionsByCountry = (countryCode) =>
    setInstitutions(onCountrySelect(countryCode));

  return [
    institutions,
    setInstitutionsByCountry,
    selectedInstitution,
    setSelectedInstitution,
  ];
};

export default useBankSelector;
