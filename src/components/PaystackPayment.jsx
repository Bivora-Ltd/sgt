import { useEffect, useRef } from 'react';
import PaystackPop from '@paystack/inline-js';
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

const PaystackPayment = ({
  amount,
  email,
  currency,
  metadata,
  onSuccess,
  onClose,
}) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: PUBLIC_KEY,
      email,
      amount: amount * 100,
      currency,
      reference: `paystack-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      metadata, // ✅ use directly
      onSuccess,
      onCancel: onClose,
    });
  }, []);

  return null;
};


export default PaystackPayment;