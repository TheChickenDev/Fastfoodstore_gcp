import * as request from '../utils/orderRequests';

export const orderCreate = async (data) => {
    try {
        const response = await request.post('create', data);
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const orderConfirm = async (id) => {
    try {
        const data = { isCompleted: true };
        const response = await request.put(`update/${id}`, data);
        return response;
    } catch (error) {
        alert(error.message);
    }
};

export const orderGetAll = async () => {
    try {
        const response = await request.get('get-all');
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const orderUpdate = async (id, formData) => {
    try {
        const response = await request.post(`update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};
