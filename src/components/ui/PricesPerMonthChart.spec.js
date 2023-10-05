import React from "react";
import { render, act } from "@testing-library/react";
import PricesPerMonthChart from "./PricesPerMonthChart";
import { resize } from "../../../tests/ResizeObserverTestSupport";

const testData = [
  { dateTime: "2023-01-01T02:00:00Z", price: 3.1 },
  { dateTime: "2023-01-02T02:00:00Z", price: 4.1 },
  { dateTime: "2023-02-01T02:00:00Z", price: 1.2 },
  { dateTime: "2023-02-02T02:00:00Z", price: 2.2 },
  { dateTime: "2023-03-01T02:00:00Z", price: 5.3 },
  { dateTime: "2023-03-02T02:00:00Z", price: 6.3 },
  { dateTime: "2023-04-01T02:00:00Z", price: 7.4 },
];

describe("PricesPerMonthChart", () => {
  it("renders proper labels", async () => {
    const { getByTestId, getByText, queryByText } = render(<PricesPerMonthChart data={testData} months={[0, 1, 2]} />);
    act(() => {
      resize();
    });
    expect(getByTestId("PricesPerMonthChart"));
    expect(getByText("2023-1")).toBeVisible();
    expect(getByText("2023-2")).toBeVisible();
    expect(getByText("2023-3")).toBeVisible();
    expect(queryByText("2023-4")).not.toBeInTheDocument();
    expect(getByText("1.7 ct/kWh")).toBeVisible();
    expect(getByText("3.6 ct/kWh")).toBeVisible();
    expect(getByText("5.8 ct/kWh")).toBeVisible();
  });
});
