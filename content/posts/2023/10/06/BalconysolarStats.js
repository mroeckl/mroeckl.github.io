import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";

const CORS_PROXY_URL = "https://corsproxy.io/";
const MASTR_URL =
  "https://www.marktstammdatenregister.de/MaStR/Einheit/EinheitJson/GetErweiterteOeffentlicheEinheitStromerzeugung";
const INBETRIEBNAMEDATUM = "Inbetriebnahmedatum%20der%20Einheit";
const BALKONSOLARFILTER = "Lage%20der%20Einheit~eq~'2961'";

const BalconysolarStats = () => {
  const [jsonData, setJsonData] = useState(null);
  const [timer, setTimer] = useState(null);
  const [gemeinde, setGemeinde] = useState("Deutschland");

  const getJsonData = async (gemeinde) => {
    try {
      const urls = getUrls(gemeinde);

      const requests = urls.map((url) => fetch(url));
      const responses = await Promise.all(requests);
      const errors = responses.filter((response) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response) => Error(response.statusText));
      }

      const json = responses.map((response) => response.json());
      const data = await Promise.all(json);

      data[0].year = 2021;
      data[1].year = 2022;
      data[2].year = 2023;

      return data;
    } catch (errors) {
      console.error(errors);
    }
  };

  const getUrls = (gemeinde) => {
    const gemeindeFilter = gemeinde ? `Gemeinde~eq~'${gemeinde}'~and~` : "";
    const urls = [];
    urls.push(
      `${CORS_PROXY_URL}?${MASTR_URL}?pageSize=0&filter=${gemeindeFilter}${BALKONSOLARFILTER}~and~${INBETRIEBNAMEDATUM}~lt~'31.12.2021'`,
    );
    urls.push(
      `${CORS_PROXY_URL}?${MASTR_URL}?pageSize=0&filter=${gemeindeFilter}${BALKONSOLARFILTER}~and~${INBETRIEBNAMEDATUM}~lt~'31.12.2022'`,
    );
    urls.push(
      `${CORS_PROXY_URL}?${MASTR_URL}?pageSize=0&filter=${gemeindeFilter}${BALKONSOLARFILTER}~and~${INBETRIEBNAMEDATUM}~lt~'31.12.2023'`,
    );
    return urls;
  };

  useEffect(() => {
    getJsonData().then((data) => {
      setJsonData(data);
    });
  }, []);

  const handleChange = (event) => {
    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      getJsonData(event.target.value).then((data) => {
        setJsonData(data);
      });
      setGemeinde(event.target.value ? event.target.value : "Deutschland");
    }, 1000);

    setTimer(newTimer);
  };

  if (jsonData !== null) {
    return (
      <div data-testid="BalconysolarStats" style={{ height: 400, marginBottom: 100 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <em>
            <strong>Registrierte Balkonkraftwerke in {gemeinde !== "" && <span>{gemeinde}</span>}</strong>
          </em>
        </div>
        Gemeinde: <input placeholder="Ganz Deutschland" type="text" onChange={handleChange} />
        <ResponsiveBar
          data={jsonData}
          margin={{ top: 20, right: 50, bottom: 30, left: 60 }}
          colors={{ scheme: "paired" }}
          theme={{ fontSize: "14px" }}
          colorBy="indexValue"
          keys={["Total"]}
          indexBy="year"
        />
      </div>
    );
  }
};
export default BalconysolarStats;
