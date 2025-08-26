import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://streetgottalent.com/api/v1";

export const getCurrentSeason = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/seasons/current`);
    return response.data.currentSeason;
  } catch (error) {
    console.error("Error fetching current season:", error);
    throw error;
  }
};

export const updateSeasonStatus = async (status) => {
  try {
    const response = await axios.patch(
      `${process.env.BASE_URL}/seasons/current/status`,
      {
        status,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating season status:", error);
    throw error;
  }
};

export const updateRegistrationFee = async (fee) => {
  try {
    const response = await axios.patch(
      `${process.env.BASE_URL}/seasons/current/registration-fee`,
      {
        registrationFee: fee,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating registration fee:", error);
    throw error;
  }
};

export const startNewSeason = async (seasonData) => {
  try {
    const response = await axios.post(
      `${process.env.BASE_URL}/seasons`,
      seasonData
    );
    return response.data;
  } catch (error) {
    console.error("Error starting new season:", error);
    throw error;
  }
};

export const updateSeasonDetails = async (id, seasonData) => {
  try {
    const response = await axios.put(`${BASE_URL}/seasons/${id}`, seasonData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating season details:", error);
    throw error;
  }
};

export const updateSeasonStage = async () => {
  try {
    const response = await fetch(`${BASE_URL}/seasons/advance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // Replace with actual token if needed
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error advancing season: " + error.message);
  }
};
