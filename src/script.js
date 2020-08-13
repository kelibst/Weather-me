import { format } from 'date-fns';
import { form, alertContainer } from './dom';

const cityKey = 'QqFCfLuVXyO7oxFlgu4nWgRjh5hYjgVA';
const cityBase = 'http://dataservice.accuweather.com/locations/v1/cities/search';
const weatherKey = '67c0476c31125a1dbcfdd521a5a88903';

// get city data from accuweather api

function weatherCheck() {
  return {

    city: '',

    async getCity(city, base, key) {
      const query = `?apikey=${key}&q=${city}`;

      const response = await fetch(base + query);
      const data = await response.json();

      return data;
    },
    async getWeather(city, key) {
      const WeatherBase = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
      const response = await fetch(WeatherBase);
      const data = await response.json();

      return data;
    },
    // setup templates for render function
    templates() {
      return {
        searchUl(data) {
          return ` <li><span>${data.EnglishName}</span><span>${data.Country.EnglishName}</span></li>`;
        },
        detailsUl(data) {
          return `<li><span>${data.name}</span><span>${data.sys.country}</span></li>
                            <li><span>${data.weather[0].main}</span><span>${data.weather[0].description}</span></li>
                            <li><span>Humidity</span><span>${data.main.humidity}</span></li>
                            <li><span>Temperature</span><span> ${Math.ceil(data.main.temp - 273.15)}&deg;</span></li>`;
        },
        mainWeather(data) {
          const dating = format(new Date(), 'MM/dd/yyyy');
          return `
                                <h2 class="deg font-weight-bolder display-1">${Math.ceil(data.main.temp - 273.15)}&deg;</h2>
                                
                                <div class="h6 location-time mx-3">
                                    <h5 class="location-text display-4">${data.name} / ${data.sys.country}</h5>
                                   ${dating}
                                   
                                </div>
                                <div class="location-icons">
                                <i class="icofont-clouds"></i>
                                    <p class="text-capitalize">${data.weather[0].description}</p>
                                </div>
                            `;
        },

      };
    },
    // function to render things on the screen
    render(node, clas, template) {
      const container = document.createElement('ul');

      container.classList = clas;
      node.innerHTML = '';
      container.innerHTML = template;
      node.appendChild(container);
    },

    outputCity(data) {
      if (data.length) {
        if (data.length > 5) {
          data = data.filter((val) => val.Country.EnglishName !== data[0].Country.EnglishName);
          data.forEach((val) => {
            this.render(document.querySelector('.search'), 'search-res text-secondary', this.templates().searchUl(val));
          });
        } else if (data.length < 5) {
          data.forEach((val) => {
            this.render(document.querySelector('.search'), 'search-res', this.templates().searchUl(val));
          });
        }
      } else {
        alertContainer.classList.add('show');
      }
    },

    startCheck() {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        // grab data from api base on input
        this.getCity(form.location.value, cityBase, cityKey)
          .then(data => {
            this.outputCity(data);
            this.city = data[0].EnglishName;
            this.getWeather(this.city, weatherKey)
              .then(data => {
                this.render(document.querySelector('.details'), 'details-res', this.templates().detailsUl(data));
                this.render(document.querySelector('.bottom'), 'location d-flex text-white', this.templates().mainWeather(data));
              });
          })
          .catch(() => alertContainer.classList.add('show'));
      });
      // load and display some data when the page loads
      document.addEventListener('DOMContentLoaded', () => {
        this.getCity('accra', cityBase, cityKey)
          .then(data => {
            this.outputCity(data);
            this.city = data[0].EnglishName;
            this.getWeather(this.city, weatherKey)
              .then(data => {
                this.render(document.querySelector('.details'), 'details-res', this.templates().detailsUl(data));
                this.render(document.querySelector('.bottom'), 'location d-flex text-white', this.templates().mainWeather(data));
              });
          })
          .catch(() => alertContainer.classList.add('show'));
      });
    },
  };
}

export default weatherCheck;