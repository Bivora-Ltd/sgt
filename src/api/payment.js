import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://streetgottalent.com/api/v1";

export const verifyPayment = async (reference, metadata) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/payments/verify`,
      {
        reference,
        metadata,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching verifying payment:", error);
    throw error;
  }
};

export const getPaymentHistory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/payments/history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
};
