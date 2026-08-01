import Flutterwave from "flutterwave-node-v3";

const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY!,
  process.env.FLUTTERWAVE_SECRET_KEY!
);

export const PLAN_PRICING_UGX: Record<number, number> = {
  1: 25000,
  3: 65000,
  6: 120000,
  12: 220000,
};

interface InitiateMobileMoneyParams {
  email: string;
  phoneNumber: string;
  amount: number;
  txRef: string;
  network: "MTN" | "AIRTEL";
  redirectUrl: string;
}

export async function initiateMobileMoneyPayment(params: InitiateMobileMoneyParams) {
  const payload = {
    tx_ref: params.txRef,
    amount: params.amount,
    currency: "UGX",
    email: params.email,
    phone_number: params.phoneNumber,
    network: params.network,
    redirect_url: params.redirectUrl,
  };

  // Uganda mobile money charge endpoint
  return flw.MobileMoney.uganda(payload);
}

export function verifyWebhookSignature(signatureHeader: string | null) {
  return signatureHeader === process.env.FLUTTERWAVE_WEBHOOK_SECRET;
}

export async function verifyTransaction(transactionId: string) {
  return flw.Transaction.verify({ id: transactionId });
}

export { flw };
