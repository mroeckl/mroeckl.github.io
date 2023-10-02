import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { containerClass, captionClass } from "./charts.module.css";

const ANYSUNDAY = new Date("2023-08-13");

const PricesPerWeekdayChart = ({ data, caption }) => {
  const weekdays = [1, 2, 3, 4, 5, 6, 0];
  const avgPricesPerWeekday = weekdays.map((weekday) => {
    const priceDataOfThisWeekday = data.filter((item) => new Date(item.dateTime).getDay() === weekday);
    const sum = priceDataOfThisWeekday.reduce((accumulator, curr) => accumulator + curr.price, 0);
    return { weekday: weekday, avgPrice: sum / priceDataOfThisWeekday.length };
  });

  function getAnyDateForThisWeekday(weekday) {
    const date = new Date(ANYSUNDAY);
    date.setDate(ANYSUNDAY.getDate() + weekday);
    return date;
  }

  function calcRelativeValue(value) {
    return (value - minPricePerWeekday) / (maxPricePerWeekday - minPricePerWeekday);
  }

  const maxPricePerWeekday = avgPricesPerWeekday.reduce(function (max, v) {
    return max.avgPrice > v.avgPrice ? max : v;
  }).avgPrice;

  const minPricePerWeekday = avgPricesPerWeekday.reduce(function (min, v) {
    return min.avgPrice < v.avgPrice ? min : v;
  }).avgPrice;

  return (
    <div className={containerClass} data-testid="PricesPerWeekdayChart">
      <ResponsiveBar
        data={avgPricesPerWeekday}
        indexBy="weekday"
        keys={["avgPrice"]}
        valueFormat={(value) => `${Number(value).toFixed(1)} ct/kWh`}
        colors={(d) => `hsl(${(1 - calcRelativeValue(d.value)) * 120}, 100%, 70%)`}
        axisLeft={{
          format: (value) => `${Number(value).toFixed(0)} ct/kWh`,
        }}
        axisBottom={{
          format: (value) => getAnyDateForThisWeekday(value).toLocaleString(undefined, { weekday: "long" }),
        }}
        margin={{ top: 20, right: 50, bottom: 30, left: 80 }}
      />
      <figcaption className={captionClass}>{caption}</figcaption>
    </div>
  );
};
export default PricesPerWeekdayChart;
