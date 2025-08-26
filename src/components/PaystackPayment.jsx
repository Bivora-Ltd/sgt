import { useEffect, useRef } from 'react';
import PaystackPop from '@paystack/inline-js';
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

const PaystackPayment = ({ amount, email, currency, onSuccess, onClose }) => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: PUBLIC_KEY,
      email,
      currency,
      amount: amount * 100,
      reference: `paystack-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      onSuccess: (response) => {
        onSuccess(response);
      },
      onCancel: () => {
        onClose();
      }
    });
    // No cleanup needed for PaystackPop
  }, []);

  return null;
};

export default PaystackPayment;