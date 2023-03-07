import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;


import debounce from "lodash.debounce";
import { Notify } from "notiflix";


const countryInputEl = document.querySelector(`#search-box`);
const countryListEl = document.querySelector('.country-list');

countryInputEl.addEventListener(`input`, 
    debounce((evn) => {
        const input = evn.target.value;
        const trimInput = input.trim();
        
        if (!trimInput) {
            countryListEl.innerHTML = '';
           return;
        };
        fetchCountries(`${trimInput}`)
            .then(data => {
                if (data.length > 10) {
                    countryListEl.innerHTML = '';
                    Notify.info("Too many matches found. Please enter a more specific name.")
                    return;
                }
                if (data.length === 1) {

                    const dataInd = data[0];

                    valuesOfCountry = { countryName: dataInd.name.official, capitalCountry: dataInd.capital[0], flagCountry: dataInd.flags.svg, languageCountry: dataInd.languages[Object.keys(dataInd.languages)[0]], populationCountry: dataInd.population };

                    countryListEl.innerHTML = `<h3 class="countrysName"><img src=${valuesOfCountry.flagCountry} alt=0 width=40  height=40>${valuesOfCountry.countryName}</h3><p>Capital:${valuesOfCountry.capitalCountry}</p><p>Population:${valuesOfCountry.populationCountry}</p><p>Languages:${valuesOfCountry.languageCountry}</p>`;
                    return;
                }
                if (data.length < 10 && data.length > 1) {
                    let result = ``;
                    
                    for (let i = 0; i < data.length; i++) {
                        result += `<h3 class="countrysName"><img src=${data[i].flags.svg} alt=0 width=40  height=40>${data[i].name.official}</h3>`;
                    }
                    countryListEl.innerHTML = result;
                    return;
                }
            })
            .catch(error => {
                countryListEl.innerHTML = '';
                Notify.failure(`Oops, there is no country with that name`); 
        });     
    }, DEBOUNCE_DELAY)
);
// -------------