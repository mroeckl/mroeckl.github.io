import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const PricesPerMonthChart = ({ data }) => {
  const months = ["2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06", "2023-07"];
  const avgPricesPerMonth = months.map((month) => {
    const priceDataOfThisMonth = data.filter((item) => item.dateTime.includes(month));
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
        margin={{ top: 20, right: 50, bottom: 50, left: 80 }}
      />
    </div>
  );
};
export default PricesPerMonthChart;
