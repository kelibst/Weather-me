import { format } from 'date-fns';

const form = document.querySelector('.form-location');
const alertContainer = document.querySelector('.error-container');
const closeContainer = document.querySelector('.close-btn');
const sideCol = document.querySelector('.side-col');
const bgCover = document.querySelector('.bg-cover');

const renderContents = () => {
  return {
    // setup templates for render function
    templates() {
      return {
        searchUl(data, ind) {
          return ` <li id="${ind}" class="searchLi"><span>${data.EnglishName}</span><span>${data.Country.EnglishName}</span></li>`;
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
      container.innerHTML = template;
      node.appendChild(container);
    },
  };
}

export {
  form, alertContainer, closeContainer, renderContents, sideCol, bgCover,
};