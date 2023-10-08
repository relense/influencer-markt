import { Button } from "../../components/Button";

const BillingPage = () => {
  const billingInformation = () => {
    return (
      <div className="flex flex-1 flex-col gap-6 rounded-xl border-[1px] p-6 shadow-md">
        <div className="text-xl font-semibold">Blling Information</div>
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">Name</div>
            <div>Nunix</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">Address</div>
            <div>Nunix</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">VAT</div>
            <div>Nunix</div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button level="primary" size="regular" title="Update" />
        </div>
      </div>
    );
  };

  const balanceInfo = () => {
    return (
      <div className="flex flex-1 flex-col gap-6 rounded-xl border-[1px] p-6 shadow-md">
        <div className="text-xl font-semibold">Balance Information</div>
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">Current Balance Amount</div>
            <div>Nunix</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-lg font-medium">IBAN</div>
            <div>Nunix</div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button level="primary" size="regular" title="Withdraw" />
        </div>
      </div>
    );
  };

  const invoices = () => {
    return (
      <div className="flex flex-1 flex-col rounded-xl border-[1px] p-6 shadow-md">
        <div className="text-xl font-semibold">Invoices</div>
      </div>
    );
  };

  return (
    <div className="flex w-full cursor-default flex-col justify-center gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full xl:w-10/12 2xl:w-3/4 3xl:w-3/4 4xl:w-7/12 5xl:w-2/4">
      <div className="flex flex-1 flex-col gap-6 lg:flex-row">
        {billingInformation()}
        {balanceInfo()}
      </div>
      {invoices()}
    </div>
  );
};

export { BillingPage };
