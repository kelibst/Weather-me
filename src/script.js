import { form, alertContainer, closeContainer, renderContents } from './dom';

const cityKey = 'QqFCfLuVXyO7oxFlgu4nWgRjh5hYjgVA';
const cityBase = 'http://dataservice.accuweather.com/locations/v1/cities/search';
const weatherKey = '67c0476c31125a1dbcfdd521a5a88903';

// get city data from accuweather api

function weatherCheck() {
  return {

    city: '',
    country: "",

    async getCity(city, base, key) {
      const query = `?apikey=${key}&q=${city}`;

      const response = await fetch(base + query);
      const data = await response.json();

      return data;
    },
    async getWeather(city, key, country) {
      const WeatherBase = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country},&appid=${key}`;
      const response = await fetch(WeatherBase);
      const data = await response.json();

      return data;
    },

    outputCity(data) {
      if (data.length) {
        if (data.length > 5) {
          data = data.filter((val) => val.Country.EnglishName !== data[0].Country.EnglishName);
          data.forEach((val) => {
            renderContents().render(document.querySelector('.search'), 'search-res text-secondary', renderContents().templates().searchUl(val));
          });
        } else if (data.length < 5) {
          data.forEach((val) => {
            renderContents().render(document.querySelector('.search'), 'search-res', renderContents().templates().searchUl(val));
          });
        }
      } else {
        alertContainer.classList.remove('d-none');
      }
    },

    startCheck() {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        // grab data from api base on input
        this.getCity(form.location.value, cityBase, cityKey)
          .then(data => {
            console.log(data)
            this.outputCity(data);
            this.city = data[0].EnglishName;
            this.country = data[0].Country.ID;
            this.getWeather(this.city, weatherKey,this.country)
              .then(data => {
                console.log(data)
                renderContents().render(document.querySelector('.details'), 'details-res', renderContents().templates().detailsUl(data));
                renderContents().render(document.querySelector('.bottom'), 'location d-flex text-white', renderContents().templates().mainWeather(data));
              });
          })
          .catch(() => alertContainer.classList.remove('d-none'));
      });
      closeContainer.addEventListener('click', ()=>{
        alertContainer.classList.add('d-none');
      })
      // load and display some data when the page loads
      document.addEventListener('DOMContentLoaded', () => {
        this.getCity('accra', cityBase, cityKey)
          .then(data => {
            this.outputCity(data);
            this.city = data[0].EnglishName;
            this.country = data[0].Country.ID;
            this.getWeather(this.city, weatherKey, this.country)
              .then(data => {
                renderContents().render(document.querySelector('.details'), 'details-res', renderContents().templates().detailsUl(data));
                renderContents().render(document.querySelector('.bottom'), 'location d-flex text-white', renderContents().templates().mainWeather(data));
              });
          })
          .catch(() => alertContainer.classList.remove('d-none'));
      });
    },
  };
}

export default weatherCheck;