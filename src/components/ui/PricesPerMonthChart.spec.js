import React from "react";
import { render, act } from "@testing-library/react";
import PricesPerMonthChart from "./PricesPerMonthChart";
import { resize } from "../../../tests/ResizeObserverTestSupport";

const testData = [
  { dateTime: "2023-01-01T01:00:00", price: 1 },
  { dateTime: "2023-01-01T01:00:00", price: 2 },
  { dateTime: "2023-02-01T01:00:00", price: 3 },
  { dateTime: "2023-02-01T01:00:00", price: 4 },
];

describe("PricesPerMonthChart", () => {
  it("is rendered", async () => {
    const { getByTestId } = render(<PricesPerMonthChart data={testData} months={[0, 1]} />);
    act(() => {
      resize();
    });
    expect(getByTestId("PricesPerMonthChart"));
  });
});
