import React, { useState, useEffect } from "react";
import "./App.css";

import {
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
} from "@material-ui/core";
import Infobox from "./Infobox";

import Table from "./Table";
import { sortData,prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import Recoveredgraph from "./Recoveredgraph";
import DeathGraph from "./Deathgraph";  
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  //useState is how we define a variable in react .Basically it stores thevalue temorarily. A react hook.
  //useEffect is a powerful code which runs a code under a given condition.
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    //this implies the code inside will run once when the component loads and not again after
    //and will run when there is a change in the useState variable.
    //async -> send request to the server , wait for it  and do something with the input
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };

  return (
    //Header
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1> COVID - 19 TRACKER </h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}> {country.name} </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <Infobox 
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <Infobox 
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <Infobox 
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Card className="cardGraph">
        <CardContent>
        <h3>Worldwide cases</h3>
             <LineGraph  />
            <div className="casesrd"> <h3>Recovered cases</h3>
            <Recoveredgraph casesType="recovered" />
            <h3>Deaths</h3>
            <DeathGraph casesType="deaths" /></div>
         
          </CardContent>
        
        </Card>
        

        
      </div>
      <Card className="app__right">
        <CardContent>
          {/* Tables */}
          <h3>Live Cases By Country</h3>
          <Table countries={tableData}></Table>
          {/* Graphs */}
          <h2 className= "quotes">Wear Your Mask 😷</h2>
          <h2 className= "quotes">Stay At Home 🏠</h2>
          <h2 className= "quotes">Stay Safe ❤️</h2>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
