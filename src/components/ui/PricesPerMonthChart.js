import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const PricesPerMonthChart = ({ data, months }) => {
  const avgPricesPerMonth = months.map((month) => {
    const priceDataOfThisMonth = data.filter((item) => new Date(item.dateTime).getMonth() == month);
    const sum = priceDataOfThisMonth.reduce((accumulator, curr) => accumulator + curr.price, 0);
    return { month: month, averagePrice: sum / priceDataOfThisMonth.length };
  });
  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={avgPricesPerMonth}
        indexBy="month"
        keys={["averagePrice"]}
        valueFormat={(value) => `${Number(value).toFixed(1)} ct/kWh`}
        colorBy="indexValue"
        colors={{ scheme: "blues" }}
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
