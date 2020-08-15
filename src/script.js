import { form, alertContainer, closeContainer, renderContents,sideCol, bgCover } from './dom';

const cityKey = 'QqFCfLuVXyO7oxFlgu4nWgRjh5hYjgVA';
const cityBase = 'http://dataservice.accuweather.com/locations/v1/cities/search';
const weatherKey = '67c0476c31125a1dbcfdd521a5a88903';

// get city data from accuweather api

function weatherCheck() {
  return {
    cityData: [],
    city: '',
    country: "",
    detailsnode: document.querySelector('.details'),
    searchNode: document.querySelector('.search'),
    bottomNode: document.querySelector('.bottom'),

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
    async getWeatherbyLocation(lat, lon, key){
      const WeatherBase = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;
      const response = await fetch(WeatherBase);
      const data = await response.json();
      return data;
    },

    outputCity(data) {
      if (data.length) {
        this.cityData = data;
        this.searchNode.innerHTML = "";
        if (data.length > 5) {
          data = data.filter((val) => val.Country.EnglishName !== data[0].Country.EnglishName);
          data.forEach((val, ind) => {
            console.log(ind)
            renderContents().render(this.searchNode, 'search-res text-secondary', renderContents().templates().searchUl(val,ind));
          });
        } else if (data.length < 5) {
          data.forEach((val, ind) => {
            renderContents().render(this.searchNode, 'search-res', renderContents().templates().searchUl(val,ind));
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
            this.detailsnode.innerHTML = "";
            this.bottomNode.innerHTML = "";
            this.outputCity(data);
            this.city = data[0].EnglishName;
            this.country = data[0].Country.ID;
            this.getWeather(this.city, weatherKey,this.country)
              .then(data => {
                const pattern = /rain/gmi;
                const pattern1 = /snow/gmi;
                if(pattern.test(data.weather[0].description)){
                  bgCover.classList="bgCover bg-rain";
                }else if(pattern1.test(data.weather[0].description)){
                  bgCover.classList="bgCover bg-snow";
                }else{
                  bgCover.classList="bgCover bg-sunny";
                };
                renderContents().render(this.detailsnode, 'details-res', renderContents().templates().detailsUl(data));
                renderContents().render(this.bottomNode, 'location d-flex text-white', renderContents().templates().mainWeather(data));
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
                const pattern = /rain/gmi;
                const pattern1 = /snow/gmi;
                if(pattern.test(data.weather[0].description)){
                  bgCover.classList="bgCover bg-rain";
                }else if(pattern1.test(data.weather[0].description)){
                  bgCover.classList="bgCover bg-snow";
                }else{
                  bgCover.classList="bgCover bg-sunny";
                };
                renderContents().render(this.detailsnode, 'details-res', renderContents().templates().detailsUl(data));
                renderContents().render(this.bottomNode, 'location d-flex text-white', renderContents().templates().mainWeather(data));
              });
          })
          .catch(() => alertContainer.classList.remove('d-none'));
      });


      //let's display weather data form a particular city when it is selected from the dom element
      sideCol.addEventListener('click', (e)=> {
        if(e.target.classList.contains('searchLi')){
          const lat = this.cityData[parseInt(e.target.id,10)].GeoPosition.Latitude;
          const lon = this.cityData[parseInt(e.target.id,10)].GeoPosition.Longitude;
          console.log(this.cityData[parseInt(e.target.id,10)])
          
          this.getWeatherbyLocation(lat, lon, weatherKey)
          .then(data=>{
            const pattern = /rain/gmi;
                const pattern1 = /snow/gmi;
                if(pattern.test(data.weather[0].description)){
                  bgCover.classList="bgCover bg-rain";
                }else if(pattern1.test(data.weather[0].description)){
                  bgCover.classList="bgCover bg-snow";
                }else{
                  bgCover.classList="bgCover bg-sunny";
                };
            this.detailsnode.innerHTML = "";
            this.bottomNode.innerHTML = "";
            renderContents().render(this.detailsnode, 'details-res', renderContents().templates().detailsUl(data));
            renderContents().render(this.bottomNode, 'location d-flex text-white', renderContents().templates().mainWeather(data))
          })
        }
      })
    },
  };
}

export default weatherCheck;