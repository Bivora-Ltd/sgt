import axios from "axios";
const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://streetgottalent.com/api/v1";

export const getAllStreetfoods = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/streetfoods/`);
    return response.data.streetFoods;
  } catch (error) {
    console.error("Error fetching all contestants:", error);
    throw error;
  }
};

export const createStreetfood = async (streetfoodData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/streetfoods/`,
      streetfoodData,
      {
        headers: {
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

export const updateStreetfood = async (id, streetfoodData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/streetfoods/${id}`,
      streetfoodData,
      {
        headers: {
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

export const deleteStreetfood = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/streetfoods/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting streetfood:", error);
    throw error;
  }
};

export const purchaseStreetfood = async (streetfoodId, contestantId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const streetfood = streetfoods.find(
        (s) => s.id === parseInt(streetfoodId)
      );
      resolve({
        streetfood,
        votes: streetfood?.votes || 1,
        contestantId: parseInt(contestantId),
      });
    }, 500);
  });
};
