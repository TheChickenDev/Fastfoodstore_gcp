import axios from 'axios';

const request = axios.create({
    baseURL: 'https://fastfoodstore-server.onrender.com' + '/api/user/',
});

export const axiosJWT = axios.create({
    baseURL: 'https://fastfoodstore-server.onrender.com' + '/api/user/',
});

export const get = async (path, options = {}) => {
    const response = await axiosJWT.get(path, options);
    return response.data;
};

export const post = async (path, options = {}) => {
    const response = await request.post(path, options);
    return response;
};

export const put = async (path, options = {}) => {
    const response = await request.put(path, options);
    return response.data;
};

export const remove = async (path, options = {}) => {
    const response = await request.delete(path, options);
    return response.data;
};

export default request;
