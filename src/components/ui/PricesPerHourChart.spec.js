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
    const { getByTestId } = render(<PricesPerHourChart data={testData} />);
    act(() => {
      resize();
    });
    expect(getByTestId("PricesPerHourChart"));
  });
});
