import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://streetgottalent.com/api/v1";

export const adminLogin = async (email, password) => {
  try {
    const url = `${BASE_URL}/admins/login`;
    const response = await axios.post(url, { email, password });
    return response.data;
  } catch (error) {
    console.error("Error during admin login:", error);
    throw error;
  }
};

export const eliminateContestant = async (contestantId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/contestants/${contestantId}/eliminate`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering contestant:", error);
    throw error;
  }
};
