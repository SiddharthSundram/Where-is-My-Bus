import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = "http://localhost:5000"; // Flask backend URL

export const flaskApiGet = async (endpoint: string) => {
  const session = await getSession();
  if (!session?.user?.accessToken) throw new Error("No access token");

  const res = await axios.get(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    withCredentials: true,
  });

  return res.data;
};

export const flaskApiPost = async (endpoint: string, data: any) => {
  const session = await getSession();
  if (!session?.user?.accessToken) throw new Error("No access token");

  const res = await axios.post(`${API_URL}${endpoint}`, data, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    withCredentials: true,
  });

  return res.data;
};
