import React, { useState, useEffect } from "react";
import { ResponsiveChoropleth } from "@nivo/geo";
import geoFeatures from "./germanState.geo";
import { containerClass } from "./BalconysolarStats.module.css";

const CORS_PROXY_URL = "https://cloudflare-cors-anywhere.mroeckl.workers.dev/?";
const MASTR_GEN_URL =
  "https://www.marktstammdatenregister.de/MaStR/Einheit/EinheitJson/GetErweiterteOeffentlicheEinheitStromerzeugung";
const BALKONSOLARFILTER = "Lage%20der%20Einheit~eq~'2961'~and~Nettonennleistung%20der%20Einheit~lt~'0.801'";
const STATUS_IN_BETRIEB = "Betriebs-Status~eq~'35'";

const states = [
  { name: "Baden-Württemberg", id: 1402, loc: "DE-BW", households: 5407000 },
  { name: "Bayern", id: 1403, loc: "DE-BY", households: 6516000 },
  { name: "Berlin", id: 1401, loc: "DE-BE", households: 2011000 },
  { name: "Brandenburg", id: 1400, loc: "DE-BB", households: 1271000 },
  { name: "Bremen", id: 1404, loc: "DE-HB", households: 351000 },
  { name: "Hamburg", id: 1406, loc: "DE-HH", households: 1008000 },
  { name: "Hessen", id: 1405, loc: "DE-HE", households: 3097000 },
  { name: "Mecklenburg-Vorpommern", id: 1407, loc: "DE-MV", households: 836000 },
  { name: "Niedersachsen", id: 1408, loc: "DE-NI", households: 3947000 },
  { name: "Nordrhein-Westfalen", id: 1409, loc: "DE-NW", households: 8717000 },
  { name: "Rheinland-Pfalz", id: 1410, loc: "DE-RP", households: 1942000 },
  { name: "Saarland", id: 1412, loc: "DE-SL", households: 483000 },
  { name: "Sachsen-Anhalt", id: 1414, loc: "DE-ST", households: 1120000 },
  { name: "Sachsen", id: 1413, loc: "DE-SN", households: 2116000 },
  { name: "Schleswig-Holstein", id: 1411, loc: "DE-SH", households: 1443000 },
  { name: "Thüringen", id: 1415, loc: "DE-TH", households: 1066000 },
];

const BalconysolarGeoStats = () => {
  const [jsonData, setJsonData] = useState(null);

  const getJsonData = async () => {
    try {
      const urls = getUrls();

      const requests = urls.map((url) => fetch(url));
      const responses = await Promise.all(requests);
      const errors = responses.filter((response) => !response.ok);

      if (errors.length > 0) {
        throw errors.map((response) => Error(response.statusText));
      }

      const json = responses.map((response) => response.json());
      const data = await Promise.all(json);

      for (let i = 0; i < data.length; i++) {
        data[i].id = states[i].loc;
        data[i].totalPer1000 = (data[i].Total / states[i].households) * 1000;
      }

      return data;
    } catch (errors) {
      console.error(errors);
    }
  };

  const getUrls = () => {
    const urls = [];
    states.forEach((state) => {
      urls.push(
        CORS_PROXY_URL +
          encodeURIComponent(
            `${MASTR_GEN_URL}?pageSize=0&filter=Bundesland~eq~'${state.id}'~and~${BALKONSOLARFILTER}'~and~${STATUS_IN_BETRIEB}`,
          ),
      );
    });
    return urls;
  };

  useEffect(() => {
    getJsonData().then((data) => {
      setJsonData(data);
    });
  }, []);

  if (jsonData !== null) {
    return (
      <div data-testid="BalconysolarGeoStats" className={containerClass}>
        <ResponsiveChoropleth
          data={jsonData}
          features={geoFeatures.features}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          colors="greens"
          domain={[8, 26]}
          label="properties.name"
          value="totalPer1000"
          valueFormat=".2s"
          projectionType="mercator"
          projectionTranslation={[-0.55, 5.0]}
          projectionScale={2600}
          borderWidth={0.5}
          tooltip={(e) => {
            return (
              <div
                style={{
                  background: "white",
                  padding: "9px 12px",
                  border: "1px solid #ccc",
                }}
              >
                <b>{e.feature.label}</b>
                <br />
                Insgesamt: {e.feature.data.Total}
                <br />
                Je 1000 Haushalte: {e.feature.formattedValue}
              </div>
            );
          }}
          legends={[
            {
              anchor: "bottom-left",
              direction: "column",
              justify: true,
              translateX: 380,
              translateY: -70,
              itemsSpacing: 0,
              itemWidth: 94,
              itemHeight: 18,
              itemDirection: "left-to-right",
              itemTextColor: "#444444",
              itemOpacity: 0.85,
              symbolSize: 18,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000000",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    );
  }
};
export default BalconysolarGeoStats;
