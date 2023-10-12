import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { containerClass, checkboxClass, locClass, captionClass } from "./BalconysolarStats.module.css";

const CORS_PROXY_URL = "https://corsproxy.io/";
const MASTR_GEN_URL =
  "https://www.marktstammdatenregister.de/MaStR/Einheit/EinheitJson/GetErweiterteOeffentlicheEinheitStromerzeugung";
const MASTR_SUM_URL = "https://www.marktstammdatenregister.de/MaStR/Einheit/EinheitJson/GetSummenDerLeistungswerte";
const INBETRIEBNAMEDATUM = "Inbetriebnahmedatum%20der%20Einheit";
const BALKONSOLARFILTER = "Lage%20der%20Einheit~eq~'2961'";

const keys = ["Registrierungen", "Wechselrichterleistung", "Modulleistung"];

const Checkbox = ({ type = "checkbox", name, checked = false, onChange }) => {
  return (
    <label htmlFor={name} className={checkboxClass}>
      <input type={type} name={name} id={name} checked={checked} onChange={onChange} />
      {name}
    </label>
  );
};

const LocInput = ({ id, label, placeholder, type = "text", onChange }) => {
  return (
    <label htmlFor="gemeinde">
      {label}:&nbsp;
      <input id={id} className={locClass} placeholder={placeholder} type={type} onChange={onChange} />
    </label>
  );
};

const BalconysolarStats = () => {
  const [jsonData, setJsonData] = useState(null);
  const [timer, setTimer] = useState(null);
  const [gemeinde, setGemeinde] = useState("Deutschland");
  const [enabledKeys, setEnabledKeys] = useState(["Registrierungen"]);

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

      const prepData = new Array(3);

      for (let i = 0; i <= 2; i++) {
        prepData[i] = {};
        prepData[i].year = 2021 + i;
        prepData[i].Registrierungen = data[i * 2].Total;
        prepData[i].Wechselrichterleistung = Math.round(data[i * 2 + 1].nettoleistungSumme);
        prepData[i].Modulleistung = Math.round(data[i * 2 + 1].bruttoleistungSumme);
      }

      return prepData;
    } catch (errors) {
      console.error(errors);
    }
  };

  const getUrls = (gemeinde) => {
    const gemeindeFilter = gemeinde ? `Gemeinde~eq~'${gemeinde}'~and~` : "";
    const urls = [];
    for (let year = 2021; year <= 2023; year++) {
      urls.push(
        `${CORS_PROXY_URL}?${MASTR_GEN_URL}?pageSize=0&filter=${gemeindeFilter}${BALKONSOLARFILTER}~and~${INBETRIEBNAMEDATUM}~lt~'31.12.${year}'`,
      );
      urls.push(
        `${CORS_PROXY_URL}?${MASTR_SUM_URL}?gridName=extSEE&filter=${gemeindeFilter}${BALKONSOLARFILTER}~and~${INBETRIEBNAMEDATUM}~lt~'31.12.${year}'`,
      );
    }
    return urls;
  };

  useEffect(() => {
    getJsonData().then((data) => {
      setJsonData(data);
    });
  }, []);

  const handleLocationChange = (event) => {
    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      getJsonData(event.target.value).then((data) => {
        setJsonData(data);
      });
      setGemeinde(event.target.value ? event.target.value : "Deutschland");
    }, 1000);

    setTimer(newTimer);
  };

  const handleEnabledKeysChange = (event) => {
    const newEnabledKeys = [...enabledKeys];
    enabledKeys.indexOf(event.target.name) === -1
      ? newEnabledKeys.push(event.target.name)
      : newEnabledKeys.splice(enabledKeys.indexOf(event.target.name), 1);
    setEnabledKeys(newEnabledKeys);
  };

  if (jsonData !== null) {
    return (
      <div data-testid="BalconysolarStats" className={containerClass}>
        <div className={captionClass}>
          Registrierte Balkonkraftwerke in {gemeinde !== "" && <span>{gemeinde}</span>}
        </div>
        <LocInput id="gemeinde" label="Gemeinde" placeholder="Ganz Deutschland" onChange={handleLocationChange} />
        {keys.map((item) => (
          <Checkbox key={item} name={item} checked={enabledKeys.includes(item)} onChange={handleEnabledKeysChange} />
        ))}
        <ResponsiveBar
          data={jsonData}
          margin={{ top: 20, right: 50, bottom: 80, left: 60 }}
          colors={{ scheme: "paired" }}
          theme={{ fontSize: "14px" }}
          label={(d) =>
            `${d.value}` + (d.id === "Registrierungen" ? "" : " kW") + (d.id === "Modulleistung" ? "p" : "")
          }
          groupMode="grouped"
          keys={enabledKeys}
          indexBy="year"
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom",
              direction: "row",
              translateY: 60,
              itemWidth: 100,
              itemHeight: 20,
              itemsSpacing: 80,
              symbolSize: 16,
              itemDirection: "left-to-right",
            },
          ]}
        />
      </div>
    );
  }
};
export default BalconysolarStats;
