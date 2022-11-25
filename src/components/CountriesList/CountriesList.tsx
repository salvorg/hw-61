import React, {useCallback, useEffect, useState} from 'react';
import {ApiCountry} from "../../types";
import axios from "axios";
import CountryInfo from "../CountryInfo/CountryInfo";

const url = 'https://restcountries.com/v2/all?fields=alpha3Code,name';
const alphaCodeUrl = 'https://restcountries.com/v2/alpha/';

const CountriesList = () => {
  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [selectedCountryInfo, setSelectedCountryInfo] = useState<ApiCountry | null>(null);

  const fetchData = useCallback(async () => {
    const countriesResponse = await axios.get<ApiCountry[]>(url);
    const promises = countriesResponse.data.map(async country => {
      const countryResponse = await axios.get<ApiCountry>(alphaCodeUrl + country.alpha3Code);

      return {
        name: country.name,
        capital: countryResponse.data.capital,
        population: countryResponse.data.population,
        borders: countryResponse.data.borders,
        alpha3Code: country.alpha3Code,
        flag: countryResponse.data.flag,
      };
    });

    const newCountries = await Promise.all(promises);
    setCountries(newCountries);
  }, []);

  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  return (
    <div style={{display: "flex", flexDirection: 'row', justifyContent: 'space-evenly'}}>
      <ol style={{height: '600px', overflowY: 'scroll'}}>
        {countries.map(country => (
          <li
            key={Math.random()}
            style={{cursor: 'pointer'}}
            onClick={() =>
              setSelectedCountryInfo({
                name: country.name,
                capital: country.capital,
                population: country.population,
                alpha3Code: country.alpha3Code,
                borders: country.borders,
                flag: country.flag,
              })}
          >
            {country.name}
          </li>
        ))}
      </ol>
      <CountryInfo info={selectedCountryInfo}/>
    </div>
  );
};

export default CountriesList;