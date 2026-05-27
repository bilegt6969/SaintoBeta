import clsx from "clsx";
import { DEFAULT_CURRENCY_CODE } from "lib/constants";

const Price = ({
  amount,
  className,
  currencyCode = DEFAULT_CURRENCY_CODE,
  currencyCodeClassName,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) => (
  <p suppressHydrationWarning={true} className={className}>
    {`${new Intl.NumberFormat("mn-MN", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      // Hardcoded to 0 fraction digits so decimals are completely stripped globally
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount))}`}
    <span
      className={clsx("ml-1 inline", currencyCodeClassName)}
    >{`${currencyCode}`}</span>
  </p>
);

export default Price;
