import React, { useState, useEffect } from "react";
import { useColorMode } from "theme-ui";
import { ResponsiveBar } from "@nivo/bar";
import { containerClass, checkboxClass, locClass, captionClass } from "./SolarStats.module.css";
import loadingImg from "./loading.gif";

const CORS_PROXY_URL = "https://cloudflare-cors-anywhere.mroeckl.workers.dev/?";
const MASTR_GEN_URL =
  "https://www.marktstammdatenregister.de/MaStR/Einheit/EinheitJson/GetErweiterteOeffentlicheEinheitStromerzeugung";
const MASTR_SUM_URL = "https://www.marktstammdatenregister.de/MaStR/Einheit/EinheitJson/GetSummenDerLeistungswerte";
const INBETRIEBNAMEDATUM = "Betriebs-Status~eq~'35'~and~Inbetriebnahmedatum%20der%20Einheit";
const SOLARFILTER = "Lage%20der%20Einheit~eq~'853,2961'";

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

const SolarStats = () => {
  const [loading, setLoading] = useState(true);
  const [jsonData, setJsonData] = useState(null);
  const [timer, setTimer] = useState(null);
  const [gemeinde, setGemeinde] = useState("Deutschland");
  const [enabledKeys, setEnabledKeys] = useState(["Registrierungen"]);

  const getJsonData = async (gemeinde) => {
    try {
      setLoading(true);
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
        prepData[i].year = i === 2 ? "heute" : "31.12." + (2022 + i);
        prepData[i].Registrierungen = data[i * 2].Total;
        prepData[i].Wechselrichterleistung = Math.round(data[i * 2 + 1].nettoleistungSumme);
        prepData[i].Modulleistung = Math.round(data[i * 2 + 1].bruttoleistungSumme);
      }

      return prepData;
    } catch (errors) {
      console.error(errors);
    } finally {
      setLoading(false);
    }
  };

  const getUrls = (gemeinde) => {
    const gemeindeFilter = gemeinde ? `Gemeinde~eq~'${gemeinde}'~and~` : "";
    const urls = [];
    for (let year = 2022; year <= 2024; year++) {
      urls.push(
        CORS_PROXY_URL +
          encodeURIComponent(
            `${MASTR_GEN_URL}?pageSize=0&filter=${gemeindeFilter}${SOLARFILTER}~and~${INBETRIEBNAMEDATUM}~lt~'31.12.${year}'`,
          ),
      );
      urls.push(
        CORS_PROXY_URL +
          encodeURIComponent(
            `${MASTR_SUM_URL}?gridName=extSEE&filter=${gemeindeFilter}${SOLARFILTER}~and~${INBETRIEBNAMEDATUM}~lt~'31.12.${year}'`,
          ),
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

  const [colorMode, setColorMode] = useColorMode();
  const textColor = colorMode === "dark" ? "white" : "black";

  if (jsonData != null) {
    return (
      <div data-testid="BalconysolarStats" className={containerClass}>
        <div className={captionClass}>
          Registrierte PV-Anlagen auf Gebäuden in {gemeinde !== "" && <span>{gemeinde}</span>}
        </div>
        <LocInput id="gemeinde" label="Gemeinde" placeholder="Ganz Deutschland" onChange={handleLocationChange} />
        {loading ? <img src={loadingImg} width={16} height={16}></img> : null}
        {keys.map((item) => (
          <Checkbox key={item} name={item} checked={enabledKeys.includes(item)} onChange={handleEnabledKeysChange} />
        ))}
        <ResponsiveBar
          data={jsonData}
          margin={{ top: 20, right: 50, bottom: 100, left: 60 }}
          colors={{ scheme: "set2" }}
          theme={{ fontSize: "14px", text: { fill: textColor } }}
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
  } else {
    return <div>Daten vom Marktstammdatenregister werden geladen!</div>;
  }
};
export default SolarStats;
