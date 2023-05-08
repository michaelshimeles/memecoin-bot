import axios from "axios";

export const honeypot = async (address: string) => {
  try {
    const response = await axios.get("https://api.honeypot.is/v2/IsHoneypot", {
      params: {
        address,
      },

    });

    console.log("API", response?.data);

    return response?.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};
