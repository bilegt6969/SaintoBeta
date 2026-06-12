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
} & React.ComponentProps<"p">) => {
  const formatted = new Intl.NumberFormat("mn-MN", {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
    // Hardcoded to 0 fraction digits so decimals are completely stripped globally
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));

  // Reduce spacing between currency symbol and number
  const tighterSpacing = formatted.replace(/\s/g, "");

  return (
    <p suppressHydrationWarning={true} className={className}>
      {tighterSpacing}
    </p>
  );
};

export default Price;
