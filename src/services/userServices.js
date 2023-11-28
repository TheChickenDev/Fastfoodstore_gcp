import * as request from '../utils/userRequests';

export const userLogin = async (email, password) => {
    try {
        const response = await request.post(`sign-in`, { email, password });
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const userRegister = async (formData) => {
    try {
        const response = await request.post(`sign-up`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const userGetDetails = async (id, access_token) => {
    try {
        const response = await request.get(`details/${id}`, {
            headers: {
                token: `Bearer ${access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const userUpdate = async (id, formData) => {
    try {
        const response = await request.put(`update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        alert(error.message);
    }
};

export const userAddToCart = async (id, data) => {
    try {
        const response = await request.post(`add-to-cart/${id}`, data);
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const userRemoveFromCart = async (id, data) => {
    try {
        const response = await request.post(`delete-from-cart/${id}`, data);
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const userClearCart = async (id) => {
    try {
        const response = await request.post(`clear-cart/${id}`);
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const refreshToken = async () => {
    try {
        const response = await request.post('refresh-token', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const userLogout = async () => {
    try {
        const response = await request.post('log-out');
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const userGetAll = async () => {
    try {
        const response = await request.get('get-all');
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const userDelete = async (id) => {
    try {
        const response = await request.remove(`delete/${id}`);
        return response;
    } catch (error) {
        alert(error.message);
    }
};
