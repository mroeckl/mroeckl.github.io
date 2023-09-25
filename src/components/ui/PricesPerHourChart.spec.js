import React from "react";
import { render, act } from "@testing-library/react";
import PricesPerHourChart from "./PricesPerHourChart";
import { resize } from "../../../tests/ResizeObserverTestSupport";

const testData = [];
for (let i = 0; i < 48; i++) {
  testData.push({
    dateTime: new Date(2023, 0, 1, 1 + i, 0),
    price: i + 1,
  });
}

describe("PricesPerHourChart", () => {
  it("is rendered", async () => {
    const { getByTestId, getByText } = render(<PricesPerHourChart data={testData} />);
    act(() => {
      resize();
    });
    expect(getByTestId("PricesPerHourChart"));

    expect(getByText("0-1")).toBeInTheDocument();
    expect(getByText("1-2")).toBeInTheDocument();
    expect(getByText("2-3")).toBeInTheDocument();
    expect(getByText("3-4")).toBeInTheDocument();
    expect(getByText("4-5")).toBeInTheDocument();
    expect(getByText("5-6")).toBeInTheDocument();
    expect(getByText("6-7")).toBeInTheDocument();
    expect(getByText("7-8")).toBeInTheDocument();
    expect(getByText("8-9")).toBeInTheDocument();
    expect(getByText("9-10")).toBeInTheDocument();
    expect(getByText("10-11")).toBeInTheDocument();
    expect(getByText("11-12")).toBeInTheDocument();
    expect(getByText("12-13")).toBeInTheDocument();
    expect(getByText("13-14")).toBeInTheDocument();
    expect(getByText("14-15")).toBeInTheDocument();
    expect(getByText("15-16")).toBeInTheDocument();
    expect(getByText("16-17")).toBeInTheDocument();
    expect(getByText("17-18")).toBeInTheDocument();
    expect(getByText("18-19")).toBeInTheDocument();
    expect(getByText("19-20")).toBeInTheDocument();
    expect(getByText("20-21")).toBeInTheDocument();
    expect(getByText("21-22")).toBeInTheDocument();
    expect(getByText("22-23")).toBeInTheDocument();
    expect(getByText("23-24")).toBeInTheDocument();
  });
});
