import React from "react";
import { render, act } from "@testing-library/react";
import PricesPerDayChart from "./PricesPerDayChart";
import { resize } from "../../../tests/ResizeObserverTestSupport";

const testData = [];
for (let i = 0; i < 29; i++) {
  testData.push({
    dateTime: new Date(2023, 0, 1 + i, 1, 0),
    price: i + 1,
  });
}

describe("PricesPerDayChart", () => {
  it("is rendered", async () => {
    const { getByTestId } = render(<PricesPerDayChart data={testData} />);
    act(() => {
      resize();
    });
    expect(getByTestId("PricesPerDayChart"));
  });
});
