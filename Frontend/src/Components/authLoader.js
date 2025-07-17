import axios from "axios";

export const checkAuthLoader = async () => {
  try {
    const res = await axios.get("http://localhost:5001/gettokendetails", {
      withCredentials: true, // 👈 important to send cookies
    });

    // Optional: return user data to route
    return res.data;
  } catch (err) {
    // If unauthorized or any error, redirect to /signin
    throw new Response("Unauthorized", {
      status: 302,
      headers: { Location: "/signin" },
    });
  }
};
