import React, {useCallback, useEffect, useState} from 'react';
import {ApiCountry, BorderedCountry} from "../../types";
import axios from "axios";

interface Props {
  info: ApiCountry | null;
}

const url = 'https://restcountries.com/v2/alpha/';

const CountryInfo: React.FC<Props> = ({info}) => {
  const [border, setBorder] = useState<BorderedCountry[]>([]);

  const fetchBorders = useCallback(async (info: {borders: []}) => {
    if (info.borders !== undefined) {
      const promises = info.borders.map(async index => {
        const countryResponse = await axios.get<BorderedCountry>(url + index);
        return {
          name: countryResponse.data.name
        };
      });

      const newBorders = await Promise.all(promises);
      setBorder(newBorders);
    } else {
      const noBorders = [{name: 'No bordered countries'}];
      setBorder(noBorders);
    }


  }, []);

  useEffect(() => {
    if (info !== null) {
      fetchBorders(info).catch(console.error);
    }
  }, [info, fetchBorders]);

  return info ? (
    <div>
      <img
        style={{
          width: '250px',
          height: '200px',
        }}
        src={info.flag}
        alt="flag"
      />
      <h2>{info.name}</h2>
      <p>Capital: {info.capital}</p>
      <p>Population: {(parseInt(info.population))/1000000} M</p>
      <p>Borders with:</p>
      <ul>
        {border.map(country => (
          <li
            key={Math.random()}
          >
            {country.name}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div>Please, select country</div>
  );
};

export default CountryInfo;