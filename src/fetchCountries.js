const searchParams = new URLSearchParams({
  fields: "name,capital,population,flags,languages,"

});

export const fetchCountries = function (name) {
  return fetch("https://restcountries.com/v3.1/name/{name}?${searchParams}")
    .then((response) => {
      if (response.status === 404) {
        throw new Error(response.status);
      }
      return response.json();
    }
  );

}
