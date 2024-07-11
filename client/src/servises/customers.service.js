import axios from "axios";
import { URL } from '../Utils/globalVaribals';
const CUSTOMERS = `${URL}/api/customer`;

// get one or all customers
const getC = async(id = null) => {
    // if(id)
    //     await axios.get(`${CUSTOMERS}/${id}`)
    //     .then(c => {console.log(c.data.customer); return c.data.customer;})
    //     .catch( err => {console.log(err.response.data);return null;})
    // else await axios.get(`${CUSTOMERS}`)
    //     .then(c => {console.log(c.data.customers); return c.data.customers;})
    //     .catch( err => {console.log(err.response.data);return null;})
    if(id)
    {
        try{
            const res = await axios.get(`${CUSTOMERS}/${id}`);
            const result = {data: res.data.customer, err: false };
            console.log("result", result);
            return result;
        }catch(err){
            const result = {data: {_id:null}, err: true };
            console.log("result", result);
            return result;
        }
    }
    else{
        try{
            console.log("get customers get " + CUSTOMERS);
            const res = await axios.get(`${CUSTOMERS}`);
            const result = {data: res.data.customers, err: false };
            console.log("result", result);
            return result;
        }catch(err){
            const result = {data: [], err: true };
            console.log("result", result);
            return result;
        }
    }
}

const createC = async(data) => {
    try{
        const res = await axios.post(`${CUSTOMERS}`, data);
        const result = {data: res.data.customerSchema, err: false };
        console.log("result", result);
        return result;
    }catch(err){
        const result = {data: {_id:null}, err: true };
        console.log("result", result);
        return result;
    }
}

const updateC = async(id, data) => {
    try{
        const res = await axios.put(`${CUSTOMERS}/${id}`, data);
        const result = {data: res.data.customerSchema, err: false };
        console.log("result", result);
        return result;
    }catch(err){
        const result = {data: {_id:null}, err: true };
        console.log("result", result);
        return result;
    }
}

const deleteC = async(id) => {
    try{
        const res = await axios.delete(`${CUSTOMERS}/${id}`);
        const result = {data: res.data.customers, err: false };
        console.log("result", result);
        return result;
    }catch(err){
        const result = {data: {_id:null}, err: true };
        console.log("result", result);
        return result;
    }
}
const uploadImageC = async(formData) => {
    try{
        const res = await axios.put(`${CUSTOMERS}/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        const result = {data: res.data.url, err: false };
        console.log("result", result);
        return result;
    }catch(err){
        const result = {data: {_id:null}, err: true };
        console.log("result", result);
        return result;
    }
}
export const customerService = {
    getC, createC, updateC, deleteC, uploadImageC
}
