import axios from "axios";

const baseURL = "/api/notes";
// const getAll = () => {
//   const request = axios.get(baseURL);
//   return request.then((response) => response.data);
// };
const getAll = () => {
  const request = axios.get(baseURL);
  const nonExisting = {
    id: 10000,
    content: "This note is not saved to server",
    important: true,
  };
  return request.then((response) => response.data.concat(nonExisting));
};

const create = (newObj) => {
  const request = axios.post(baseURL, newObj);
  return request.then((response) => response.data);
};

const update = (id, newObj) => {
  const request = axios.put(`${baseURL}/${id}`, newObj);
  return request.then((res) => res.data);
};

export default { getAll, create, update };
