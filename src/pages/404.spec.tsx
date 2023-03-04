import React from "react";
import { render } from "@testing-library/react";
import NotFound from "./404";

describe("NotFound", () => {
  it("renders correctly with 404 text", () => {
    const { getByText } = render(<NotFound />);
    expect(getByText(/404/i));
  });
});
