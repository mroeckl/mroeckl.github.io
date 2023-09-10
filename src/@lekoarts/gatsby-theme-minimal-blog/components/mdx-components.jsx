import MdxComponents from "@lekoarts/gatsby-theme-minimal-blog/src/components/mdx-components";
import PricesPerDayChart from "../../../components/ui/PricesPerDayChart";
import PricesPerHourChart from "../../../components/ui/PricesPerHourChart";
import PricesPerMonthChart from "../../../components/ui/PricesPerMonthChart";
import PricesPerWeekdayChart from "../../../components/ui/PricesPerWeekdayChart";
import { Message } from "theme-ui";

console.log("Test2");

export default {
  ...MdxComponents,
  Message,
  PricesPerDayChart,
  PricesPerHourChart,
  PricesPerMonthChart,
  PricesPerWeekdayChart,
};
