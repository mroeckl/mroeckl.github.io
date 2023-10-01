import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const PricesPerMonthChart = ({ data, months }) => {
  const avgPricesPerMonth = months.map((month) => {
    const priceDataOfThisMonth = data.filter((item) => new Date(item.dateTime).getMonth() == month);
    const sum = priceDataOfThisMonth.reduce((accumulator, curr) => accumulator + curr.price, 0);
    return { month: month, avgPrice: sum / priceDataOfThisMonth.length };
  });

  function calcRelativeValue(value) {
    return (value - minAvgPrice) / (maxAvgPrice - minAvgPrice);
  }

  const maxAvgPrice = avgPricesPerMonth.reduce(function (max, v) {
    return max.avgPrice > v.avgPrice ? max.avgPrice : v.avgPrice;
  });

  const minAvgPrice = avgPricesPerMonth.reduce(function (min, v) {
    return min.avgPrice < v.avgPrice ? min.avgPrice : v.avgPrice;
  });

  return (
    <div style={{ height: 400 }} data-testid="PricesPerMonthChart">
      <ResponsiveBar
        data={avgPricesPerMonth}
        indexBy="month"
        keys={["avgPrice"]}
        valueFormat={(value) => `${Number(value).toFixed(1)} ct/kWh`}
        colors={(d) => `hsl(${(1 - calcRelativeValue(d.value)) * 120}, 100%, 70%)`}
        axisLeft={{
          format: (value) => `${Number(value)} ct/kWh`,
        }}
        axisBottom={{
          format: (value) => `2023-${Number(value) + 1}`,
        }}
        margin={{ top: 20, right: 50, bottom: 50, left: 80 }}
      />
    </div>
  );
};
export default PricesPerMonthChart;
