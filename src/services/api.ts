import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333/",
});

export const getItems = () => {
  return api.get("items").then((response) => {
    return response.data;
  });
};

export const savePoint = async (data: Object) => {
  return await api.post("points", data);
};
