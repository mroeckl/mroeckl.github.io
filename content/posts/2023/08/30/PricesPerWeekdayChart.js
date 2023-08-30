import React from "react";
import { ResponsiveBar } from "@nivo/bar";
const ANYSUNDAY = new Date("2023-08-13");

const PricesPerWeekdayChart = ({ data }) => {
  const weekdays = [1, 2, 3, 4, 5, 6, 0];
  const avgPricesPerWeekday = weekdays.map((weekday) => {
    const priceDataOfThisWeekday = data.filter((item) => new Date(item.dateTime).getDay() === weekday);
    const sum = priceDataOfThisWeekday.reduce((accumulator, curr) => accumulator + curr.price, 0);
    return { weekday: weekday, averagePrice: sum / priceDataOfThisWeekday.length };
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
    return max > v.averagePrice ? max : v.averagePrice;
  });

  const minPricePerWeekday = avgPricesPerWeekday.reduce(function (min, v) {
    return min < v.averagePrice ? min : v.averagePrice;
  });

  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={avgPricesPerWeekday}
        indexBy="weekday"
        keys={["averagePrice"]}
        valueFormat={(value) => `${Number(value).toFixed(1)} ct/kWh`}
        colors={(d) => `hsl(${(1 - calcRelativeValue(d.value)) * 120}, 100%, 70%)`}
        axisLeft={{
          format: (value) => `${Number(value).toFixed(0)} ct/kWh`,
        }}
        axisBottom={{
          format: (value) => getAnyDateForThisWeekday(value).toLocaleString(undefined, { weekday: "long" }),
        }}
        margin={{ top: 20, right: 50, bottom: 50, left: 80 }}
      />
    </div>
  );
};
export default PricesPerWeekdayChart;
