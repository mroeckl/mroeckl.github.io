import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const PricesPerHourChart = ({ data }) => {
  const hours = Array(24)
    .fill()
    .map((x, i) => i);
  const avgPricesPerHour = hours.map((hour) => {
    const priceDataOfThisHour = data.filter((item) => new Date(item.dateTime).getHours() === hour);
    const sum = priceDataOfThisHour.reduce((accumulator, curr) => accumulator + curr.price, 0);
    return { hour: hour, averagePrice: sum / priceDataOfThisHour.length };
  });

  function calcRelativeValue(value) {
    return (value - minPricePerHour) / (maxPricePerHour - minPricePerHour);
  }

  const maxPricePerHour = avgPricesPerHour.reduce(function (max, v) {
    return max > v.averagePrice ? max : v.averagePrice;
  });

  const minPricePerHour = avgPricesPerHour.reduce(function (min, v) {
    return min < v.averagePrice ? min : v.averagePrice;
  });
  return (
    <div style={{ height: 400 }} data-testid="PricesPerHourChart">
      <ResponsiveBar
        data={avgPricesPerHour}
        indexBy="hour"
        keys={["averagePrice"]}
        valueFormat={(value) => `${Number(value).toFixed(1)}`}
        colors={(d) => `hsl(${(1 - calcRelativeValue(d.value)) * 120}, 100%, 70%)`}
        axisLeft={{
          format: (value) => `${Number(value).toFixed(0)} ct/kWh`,
        }}
        axisBottom={{
          format: (value) => `${value}-${Number(value) + 1}`,
        }}
        margin={{ top: 20, right: 50, bottom: 50, left: 80 }}
      />
    </div>
  );
};
export default PricesPerHourChart;
