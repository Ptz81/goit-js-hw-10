

export const fetchCountries = function (name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=,name,capital,population,flags,languages,`)
    .then(response => {
      if (response.status === 404) {
        return[];
      }
      return response.json();
    })
    .catch(error => {
      console.error(error);
    });
};
