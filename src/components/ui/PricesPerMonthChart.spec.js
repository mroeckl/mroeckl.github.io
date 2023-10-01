import React from "react";
import { render, act } from "@testing-library/react";
import PricesPerMonthChart from "./PricesPerMonthChart";
import { resize } from "../../../tests/ResizeObserverTestSupport";

const testData = [
  { dateTime: "2023-01-01T02:00:00Z", price: 3 },
  { dateTime: "2023-01-01T02:00:00Z", price: 4 },
  { dateTime: "2023-02-01T02:00:00Z", price: 1 },
  { dateTime: "2023-02-01T02:00:00Z", price: 2 },
  { dateTime: "2023-03-01T02:00:00Z", price: 5 },
  { dateTime: "2023-03-01T02:00:00Z", price: 6 },
];

describe("PricesPerMonthChart", () => {
  it("renders proper labels", async () => {
    const { getByTestId, getByText, queryByText } = render(<PricesPerMonthChart data={testData} months={[0, 1, 2]} />);
    act(() => {
      resize();
    });
    expect(getByTestId("PricesPerMonthChart"));
    expect(getByText("2023-1")).toBeInTheDocument();
    expect(getByText("2023-2")).toBeInTheDocument();
    expect(getByText("2023-3")).toBeInTheDocument();
    expect(queryByText("2023-4")).not.toBeInTheDocument();
  });
});
