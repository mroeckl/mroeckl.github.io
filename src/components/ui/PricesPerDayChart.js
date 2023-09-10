import React from "react";
import { ResponsiveLine } from "@nivo/line";

function getLineChartData(priceData) {
  const pricesThisMonth = priceData.map((item) => {
    return { x: item.dateTime, y: item.price };
  });

  const data = [
    {
      id: "Average Energy Prices per Day",
      color: "hsl(46, 82%, 55%)",
      data: getAvgPricePerDay(pricesThisMonth),
    },
    {
      id: "Energy Prices per Hour",
      color: "hsl(46, 82%, 83%)",
      data: pricesThisMonth,
    },
  ];
  return data;
}

function getAvgPricePerDay(pricesThisMonth) {
  const days = Array(31)
    .fill()
    .map((x, i) => i + 1);
  const avgPricesPerDay = days.map((day) => {
    const priceDataOfThisDay = pricesThisMonth.filter((item) => new Date(item.x).getDate() === day);
    const sum = priceDataOfThisDay.reduce((accumulator, curr) => accumulator + curr.y, 0);
    return { x: priceDataOfThisDay[0].x, y: sum / priceDataOfThisDay.length };
  });
  return avgPricesPerDay;
}

const PricesPerDayChart = ({ data }) => {
  return (
    <div style={{ height: 400 }}>
      <ResponsiveLine
        data={getLineChartData(data)}
        margin={{ top: 20, right: 50, bottom: 50, left: 80 }}
        useMesh={true}
        enableGridX={false}
        enablePoints={false}
        xScale={{
          type: "time",
          format: "%Y-%m-%dT%H:%M:%S.000Z",
          precision: "minute",
        }}
        xFormat="time:%Y-%m-%d %H:%M"
        yFormat={(value) => `${Number(value).toFixed(1)} ct/kWh`}
        colors={(d) => d.color}
        legends={[
          {
            anchor: "top-right",
            direction: "column",
            justify: false,
            translateX: -100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        axisBottom={{
          tickValues: 5,
          format: (value) => {
            return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
          },
        }}
        axisLeft={{
          format: (value) => {
            return value + " ct/kWh";
          },
        }}
      />
    </div>
  );
};
export default PricesPerDayChart;
