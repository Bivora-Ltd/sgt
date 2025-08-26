import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://streetgottalent.com/api/v1";

export const getAllContestants = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/contestants/current`);
    return response.data.contestants;
  } catch (error) {
    console.error("Error fetching all contestants:", error);
    throw error;
  }
};

export const getContestantById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/contestants/current/${id}`);
    return response.data.contestant;
  } catch (error) {
    console.error("Error fetching contestant by id:", error);
    throw error;
  }
};

export const registerContestant = async (contestantData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/contestants/register`,
      contestantData
    );
    return response.data;
  } catch (error) {
    console.error("Error registering contestant:", error);
    throw error;
  }
};

export const voteForContestant = async (contestantId, streetfoodId, qty) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/contestants/vote/`,
      {
        contestant: contestantId,
        streetfood: streetfoodId,
        qty,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error voting for contestant:", error);
    throw error;
  }
};
