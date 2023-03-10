import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from "lodash.debounce";
import { Notify } from "notiflix";

const DEBOUNCE_DELAY = 300;

const countryInputEl = document.querySelector(`#search-box`);
const countryListEl = document.querySelector('.country-list');

function manyMatchesNotify() {
    countryListEl.innerHTML = '';
    Notify.info("Too many matches found. Please enter a more specific name.");
}

function noCountryNotify() {
    countryListEl.innerHTML = '';
    Notify.failure(`Oops, there is no country with that name`);
}
countryInputEl.addEventListener(`input`, 
    debounce((evn) => {
        const input = evn.target.value;
        const trimInput = input.trim();
        
        if (!trimInput) {
            countryListEl.innerHTML = '';
           return;
        }

        fetchCountries(`${trimInput}`)
            .then(data => {
                if (data.length > 10) {
                    manyMatchesNotify();
                    return;
                }
                if (data.length === 1) {

                    const dataInd = data[0];
                    
                    const valuesOfCountry = {
                        countryName: dataInd.name.official,
                        capitalCountry: dataInd.capital[0],
                        flagCountry: dataInd.flags.svg,
                        languageCountry: dataInd.languages,
                        populationCountry: dataInd.population
                    };
                    
                    countryListEl.innerHTML = `<h3 class="countrysName">
                        <img src=${valuesOfCountry.flagCountry} alt="flag" width=40  height=40> ${valuesOfCountry.countryName}</h3>
                        <p>Capital: ${valuesOfCountry.capitalCountry}</p>
                        <p>Population: ${valuesOfCountry.populationCountry}</p>
                        <p>Languages: ${Object.values(valuesOfCountry.languageCountry).join(`, `)}</p>`;
                    return;
                }
                if (data.length < 10 && data.length > 1) {
                    let result = ``;
                    for (let i = 0; i < data.length; i++) {
                        result += `<h3 class="countrysName">
                            <img src=${data[i].flags.svg} alt="flag" width=40  height=40> ${data[i].name.official}</h3>`;
                    }
                    countryListEl.innerHTML = result;
                    return;
                }
            })
            .catch(error => {
                noCountryNotify();
        });     
    }, DEBOUNCE_DELAY)
);
// -------------

