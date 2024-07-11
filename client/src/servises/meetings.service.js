import axios from "axios";
import { URL } from '../Utils/globalVaribals';
const MEETINGS = `${URL}/api/meeting`;

// get one or all MEETINGS
const getM = async(id = null) => {
    // if(id)
    //     await axios.get(`${MEETINGS}/${id}`)
    //     .then(c => {console.log(c.data.customer); return c.data.customer;})
    //     .catch( err => {console.log(err.response.data);return null;})
    // else await axios.get(`${MEETINGS}`)
    //     .then(c => {console.log(c.data.MEETINGS); return c.data.MEETINGS;})
    //     .catch( err => {console.log(err.response.data);return null;})
    if(id)
    {
        try{
            const res = await axios.get(`${MEETINGS}/${id}`);
            const result = {data: res.data.meeting, err: false };
            console.log("result", result);
            return result;
        }catch(err){
        console.log("err:", err.response.data.error);
        const result = {data: {_id:null}, err: true, msg: err.response.data.error};
            console.log("result", result);
            return result;
        }
    }
    else{
        try{
            const res = await axios.get(`${MEETINGS}`);
            const result = {data: res.data.meetings, err: false };
            console.log("result", result);
            return result;
        }catch(err){
        console.log("err:", err.response.data.error);
        const result = {data: {_id:null}, err: true, msg: err.response.data.error};
            console.log("result", result);
            return result;
        }
    }
}

const createM = async(data) => {
    try{
        const res = await axios.post(`${MEETINGS}`, data);
        const result = {data: res.data.meetingSchema, err: false };
        console.log("result", result);
        return result;
    }catch(err){
        console.log("err:", err.response.data.error);
        const result = {data: {_id:null}, err: true, msg: err.response.data.error};
        console.log("result", result);
        return result;
    }
}

const updateM = async(id, data) => {
    try{
        const res = await axios.put(`${MEETINGS}/${id}`, data);
        const result = {data: res.data.meetingSchema, err: false };
        console.log("result", result);
        return result;
    }catch(err){
        console.log("err:", err.response.data.error);
        const result = {data: {_id:null}, err: true, msg: err.response.data.error};
        console.log("result", result);
        return result;
    }
}

const deleteM = async(id) => {
    try{
        const res = await axios.delete(`${MEETINGS}/${id}`);
        const result = {data: res.data.meetings, err: false };
        console.log("result", result);
        return result;
    }catch(err){
        console.log("err:", err.response.data.error);
        const result = {data: {_id:null}, err: true, msg: err.response.data.error};
        console.log("result", result);
        return result;
    }
}
export const meetingService = {
    getM, createM, updateM, deleteM
}
