import React from "react";
import { render, screen, act } from "@testing-library/react";
import PricesPerWeekdayChart from "./PricesPerWeekdayChart";
import { resize } from "../../../tests/ResizeObserverTestSupport";

const testData = [
  { dateTime: "2023-01-01T01:00:00.000Z", price: 1 },
  { dateTime: "2023-01-02T01:00:00.000Z", price: 2 },
  { dateTime: "2023-01-03T01:00:00.000Z", price: 2 },
  { dateTime: "2023-01-04T01:00:00.000Z", price: 2 },
  { dateTime: "2023-01-05T01:00:00.000Z", price: 2 },
  { dateTime: "2023-01-06T01:00:00.000Z", price: 2 },
  { dateTime: "2023-01-07T01:00:00.000Z", price: 2 },
  { dateTime: "2023-02-01T01:00:00.000Z", price: 4 },
];

describe("PricesPerWeekdayChart", () => {
  it("renders x axis with proper labels", async () => {
    const { getByTestId } = render(<PricesPerWeekdayChart data={testData} />);
    act(() => {
      resize();
    });
    expect(getByTestId("PricesPerWeekdayChart"));
    expect(screen.getByText("Sunday")).toBeInTheDocument();
    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Tuesday")).toBeInTheDocument();
    expect(screen.getByText("Wednesday")).toBeInTheDocument();
    expect(screen.getByText("Thursday")).toBeInTheDocument();
    expect(screen.getByText("Friday")).toBeInTheDocument();
    expect(screen.getByText("Saturday")).toBeInTheDocument();
  });
});
