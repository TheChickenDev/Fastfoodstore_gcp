import * as request from '../utils/productRequests';

export const productCreate = async (formData) => {
    try {
        const response = await request.post('create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const productGetAll = async () => {
    try {
        const response = await request.get('get-all');
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const productGetDetails = async (id) => {
    try {
        const response = await request.get(`details/${id}`);
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

export const productUpdate = async (id, formData) => {
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

export const productDelete = async (id) => {
    try {
        const response = await request.remove(`delete/${id}`);
        return response;
    } catch (error) {
        alert(error.message);
    }
};
