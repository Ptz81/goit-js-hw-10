//імпорти

import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

//елементи та змінні
const DEBOUNCE_DELAY = 300;

const inputElem = document.querySelector('#search-box');
const countryListElem = document.querySelector('.country-list');
const countryInfoElem = document.querySelector('.country-info');

//слухач на input

inputElem.addEventListener('input', debounce(handlerCountrySearch, DEBOUNCE_DELAY, { trailing: true }));

  //функція на введення із debounce
  function handlerCountrySearch(e) {

    //заборона перевантаження сторінки
    e.preventDefault();


    //у місці введення беремо дані
    const searchedCountry = e.target.value.trim();
    // countryListElem.innerHTML = '';
    // countryInfoElem.innerHTML = '';
    //якщо порожня стрічка виходимо
    if (searchedCountry == '') {
      countryListElem.innerHTML = '';
      countryInfoElem.innerHTML = '';
      return
    }

    //запуск функції із зовнішнього файлу, яка приймає введені дані
    fetchCountries(searchedCountry)
      .then(result => {
      if (result.length > 10) {
        Notiflix.Notify.warning('Too many matches found. Please enter a more specific name');
        return;
      }
      foundCountries(result);
    })
      .catch(error => {
        countryListElem.innerHTML = '';
        countryInfoElem.innerHTML = '';
        Notiflix.Notify.failure('Oops, there is no country with that name');
      })
  };

//приймаємо результати
function foundCountries(result) {
  //перевіряємо кількість знайдених даних
  let inputData = result.length;

  //якщо знайдено від 2-10, ми виводимо просту розмітку
  if (inputData >= 2 && inputData <= 10) {
    const mark = result
    .map(res => {
      return `<li>
      <img src="${res.flags.svg}" alt="Flag of ${res.name.official}" width="30" hight="20">
        <p><b>${res.name.official}</b></p>
      </li>`;
    })
    .join('');
    countryListElem.innerHTML = mark;

  //якщо знайдено 1 результат, ми виводимо розширену розмітку
        } else if (inputData === 1) {

    const mark = result
    .map(res => {
      return `<li>
      <img src="${res.flags.svg}" alt="Flag of ${res.name.official}" width="30" hight="20">
        <p><b>${res.name.official}</b></p>
        <p><b>Capital</b>: ${res.capital}</p>
        <p><b>Population</b>: ${res.population}</p>
        <p><b>Languages</b>: ${Object.values(res.languages)} </p>
      </li>`;
    })
    .join('');
    countryListElem.innerHTML = mark;
        }

};
/*
1+.  https://restcountries.com/v3.1/name/{name}
Використовуй публічний API Rest Countries v2, а саме ресурс name, який повертає масив об'єктів країн,
що задовольнили критерій пошуку.

2. Додай мінімальне оформлення елементів інтерфейсу.

3+. Напиши функцію fetchCountries(name), яка робить HTTP-запит на ресурс name і повертає проміс з масивом країн
 - результатом запиту.

 4+. Винеси її в окремий файл fetchCountries.js і зроби іменований експорт.
 5. Щоб скоротити обсяг переданих даних, додай рядок параметрів запиту - таким чином цей бекенд реалізує фільтрацію полів.
 Ознайомся з документацією синтаксису фільтрів.

Тобі потрібні тільки наступні властивості:

    name.official - повна назва країни
    capital - столиця
    population - населення
    flags.svg - посилання на зображення прапора
    languages - масив мов

  6. Назву країни для пошуку користувач вводить у текстове поле input#search-box.
  HTTP-запити виконуються при введенні назви країни, тобто на події input. Але робити запит з кожним натисканням клавіші не можна,
  оскільки одночасно буде багато запитів і вони будуть виконуватися в непередбачуваному порядку.

  7.Необхідно застосувати прийом Debounce на обробнику події і робити HTTP-запит через 300мс після того, як користувач перестав вводити текст.
  Використовуй пакет lodash.debounce.

  8. Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується, а розмітка списку країн або інформації про країну зникає.

  9+. Виконай санітизацію введеного рядка методом trim(), це вирішить проблему, коли в полі введення тільки пробіли, або вони є на початку і в кінці рядка.

  10. Якщо у відповіді бекенд повернув більше ніж 10 країн, в інтерфейсі з'являється повідомлення про те, що назва повинна бути специфічнішою.
  Для повідомлень використовуй бібліотеку notiflix і виводь такий рядок "Too many matches found. Please enter a more specific name.".

  11. Якщо бекенд повернув від 2-х до 10-и країн, під тестовим полем відображається список знайдених країн. Кожен елемент списку складається з прапора та назви країни.

  12. Якщо результат запиту - це масив з однією країною, в інтерфейсі відображається розмітка картки з даними про країну: прапор, назва, столиця, населення і мови.

  13. Якщо користувач ввів назву країни, якої не існує, бекенд поверне не порожній масив, а помилку зі статус кодом 404 - не знайдено.
  Якщо це не обробити, то користувач ніколи не дізнається про те, що пошук не дав результатів.
  Додай повідомлення "Oops, there is no country with that name" у разі помилки, використовуючи бібліотеку notiflix.

  14. Не забувай про те, що fetch не вважає 404 помилкою, тому необхідно явно відхилити проміс, щоб можна було зловити і обробити помилку.
*/