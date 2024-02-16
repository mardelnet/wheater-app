import './App.scss';
import { useState, useEffect } from 'react';

function App() {
  const countriesApi = 'https://countriesnow.space/api/v0.1/countries';
  const locationApi = 'https://geocode.maps.co/search?api_key=65cf4a66cf5d9858186263twje8a11e&q=';
  const weatherApi = 'https://api.open-meteo.com/v1/forecast?hourly=precipitation_probability,wind_speed_180m,temperature_180m&forecast_days=4';

  const [countries, setCountries] = useState(null);
  const [states, setStates] = useState(null);
  const [cities, setCities] = useState(null);
  const [weather, setWeather] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedAreaLocation, setSelectedAreaLocation] = useState(null);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedAreaLocation) {
      async function fetchData() {
        const fetchUrl = `${weatherApi}&latitude=${selectedAreaLocation.lat}&longitude=${selectedAreaLocation.lon}`
        const data = await fetchdata( fetchUrl )
        setWeather(data)
      }
      fetchData();
    }
  }, [selectedAreaLocation]);

  useEffect(() => {
    if (selectedCountry && selectedState && selectedCity) {
      async function fetchData() {
        const filteredCityName = selectedCity.replace(/ /g, "%");
        const filteredStateName = selectedState.replace(/ /g, "%");
        const filteredCountryName = selectedCountry.replace(/ /g, "%");

        const location = `${filteredCityName},${filteredStateName},${filteredCountryName}`
        const locationUrl = locationApi + location
        const data = await fetchdata( locationUrl )

        const locationCoords = {
          'lat' : data[0].lat,
          'lon' : data[0].lon
        }

        setSelectedAreaLocation(locationCoords)
      }
      fetchData();
    }
  }, [selectedCity]);
  
  useEffect(() => {
    async function fetchData() {
      const data = await fetchdata( countriesApi + '/flag/images' )
      setCountries(data)
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      async function fetchData() {
        const fetchDetails = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "country": `${selectedCountry}` })
        }
    
        const data = await fetchdata( countriesApi + '/states', fetchDetails)
        setStates(data)
      }
      fetchData();
    }
  }, [selectedCountry]);
  
  useEffect(() => {
    if (selectedState) {
      async function fetchData() {
        const fetchDetails = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "country": `${selectedCountry}`, "state": `${selectedState}` })
        }
  
        const data = await fetchdata( countriesApi + '/state/cities', fetchDetails)
        setCities(data)
      }
      fetchData();
    }
  }, [selectedCountry, selectedState]);

  const fetchdata = async (endpoint, details = {}) => {
    try {
      const response = await fetch(endpoint, details);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      return jsonData
    } catch (error) {
      setError(error);
    }
  };

  const handleSelectCountry = (event) => {
    setSelectedCountry(event.target.value);
    setStates(null)
    setSelectedState(null)
    setCities(null)
    setSelectedCity(null)
  };

  const handleSelectState = (event) => {
    setSelectedState(event.target.value);
    setCities(null)
    setSelectedCity(null)
  };

  const handleSelectCity = (event) => {
    setSelectedCity(event.target.value);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log(weather)

  return (
    <div className="App">
      <header className="App-header">
        {countries && (
          <select name="countries" id="countries" value={selectedCountry} onChange={handleSelectCountry}>
            {countries.data.map((item, index) => (
              <option key={index} value={item.name}>{item.name}</option>
            ))}
            </select>
        )}
        {states && (
          <select name="states" id="states" value={selectedState} onChange={handleSelectState}>
            {states.data.states.map((item, index) => (
              <option key={index} value={item.name}>{item.name}</option>
            ))}
            </select>
        )}
        {cities && (
          <select name="cities" id="cities" value={selectedCity} onChange={handleSelectCity}>
            {cities.data.map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
            </select>
        )}
        {weather && (
          <>
            <div>Today Morning: {weather.hourly.temperature_180m[8]}</div>
            <div>Today Afternoon: {weather.hourly.temperature_180m[16]}</div>
            <div>Today Evening: {weather.hourly.temperature_180m[21]}</div>

            <div>Tomorrow Morning: {weather.hourly.temperature_180m[8]}</div>
            <div>Tomorrow Afternoon: {weather.hourly.temperature_180m[16]}</div>
            <div>Tomorrow Evening: {weather.hourly.temperature_180m[21]}</div>

            <div>Day After Tomorrow Morning: {weather.hourly.temperature_180m[8]}</div>
            <div>Today Afternoon: {weather.hourly.temperature_180m[16]}</div>
            <div>Today Evening: {weather.hourly.temperature_180m[21]}</div>
          </>
        )}
        {/* {weather && weather.hourly.temperature_180m.map((item, index) => (
          <option key={index} value={item}>{item}</option>
        ))} */}
      </header>
    </div>
  );
}

export default App;
