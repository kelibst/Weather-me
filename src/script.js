import {form} from './dom';
const cityKey= "QqFCfLuVXyO7oxFlgu4nWgRjh5hYjgVA";
const cityBase = 'http://dataservice.accuweather.com/locations/v1/cities/search';
`<div class="alert alert-warning alert-dismissible fade show" role="alert">
<strong>Holy guacamole!</strong> You should check in on some of those fields below.
<button type="button" class="close" data-dismiss="alert" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
</div>`

//get city data from accuweather api

function Templates(){
    return {
        ulTemplate(data){
           
            `   <li><span>${data}</span><span>${data.Country.EnglishName}</span></li>`
        }
    }
}

function weatherCheck(){
    return {
        locationKey: `QqFCfLuVXyO7oxFlgu4nWgRjh5hYjgVA`,

        city: "",

        async getCity(city,base, key){
            
            const query= `?apikey=${key}&q=${city}`;

            const response = await fetch(base + query);
            const data = await response.json();

            return data
        },
        
        
        render(node, clas, data){
            const container = document.createElement('ul');
            let searchUl= ` <li><span>${data.EnglishName}</span><span>${data.Country.EnglishName}</span></li>`;
            container.classList = clas;
            container.innerHTML = "";
            container.innerHTML = searchUl;
            node.appendChild(container);
        },

        outputCity(data){
            if(data.length){

                if(data.length > 5){
                    
                    data = data.filter((val)=>{
                        return val.Country.EnglishName !== data[0].Country.EnglishName
                    })
                        data.forEach((val) => {
                                
                            this.render(document.querySelector('.search'), 'search-res', val);
                            
                        })
                        
                }else if(data.length < 5){
                    data.forEach((val) => {
                        this.render(document.querySelector('.search'), 'search-res', val);
                    })
                }
                
            }  
        },

        startCheck(){
            form.addEventListener('submit', (e)=>{
                e.preventDefault();
                //grab data from api base on input
                this.getCity(form.location.value, cityBase, cityKey)
                .then(data => {
                    this.outputCity(data);
                    this.city = data[0].EnglishName;
                })
                .catch(err => console.log(err));
            })
        }
    }
}

export {weatherCheck}