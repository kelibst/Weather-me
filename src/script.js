import {form} from './dom';
const key= "QqFCfLuVXyO7oxFlgu4nWgRjh5hYjgVA";
`<div class="alert alert-warning alert-dismissible fade show" role="alert">
<strong>Holy guacamole!</strong> You should check in on some of those fields below.
<button type="button" class="close" data-dismiss="alert" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
</div>`

//get city data from accuweather api
const getLocation = async (city) => {
            const base = 'http://dataservice.accuweather.com/locations/v1/cities/search';
            const query= `?apikey=${key}&q=${city}`;

            const response = await fetch(base + query);
            const data = await response.json();

            console.log(data);
}

function weatherCheck(){
    return {
        locationKey: `QqFCfLuVXyO7oxFlgu4nWgRjh5hYjgVA`,

        
        startCheck(){
            form.addEventListener('submit', (e)=>{
                e.preventDefault();
                getLocation("accra")
            })
        }
    }
}

export {weatherCheck}