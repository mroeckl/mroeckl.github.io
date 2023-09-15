import MdxComponents from "./mdx-components";

describe("mdx-components", () => {
  it("default exports correctly", () => {
    expect(MdxComponents.Message).toBeTruthy();
    expect(MdxComponents.PricesPerDayChart).toBeTruthy();
    expect(MdxComponents.PricesPerHourChart).toBeTruthy();
    expect(MdxComponents.PricesPerMonthChart).toBeTruthy();
    expect(MdxComponents.PricesPerWeekdayChart).toBeTruthy();
  });
});
