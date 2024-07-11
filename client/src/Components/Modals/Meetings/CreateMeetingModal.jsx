import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate} from 'react-router-dom';
import {meetingService} from '../../../servises/meetings.service';
import { customerService } from '../../../servises/customers.service';
import Input from "react-phone-number-input/input";
import {Image} from 'react-bootstrap';
import addMeetingImage from "../../../images/meeting-add.png"

const CreateMeetingModal = (props) => {

    const [inputCustomer, setInputCustomer] = useState("");
    const [inputTitle, setInputTitle] = useState("");
    const [inputDate, setInputDate] = useState("");
    const [inputStatus, setInputStatus] = useState("");
    const [inputText, setInputText] = useState("");
    const [newborn, setNewborn] = useState(false)
    const handleClick = () => setNewborn(!newborn)

    useEffect(()=>{
        console.log("inputDate", inputDate);
    },[inputDate])
    const createMeeting = async() => {
        const dataT = await meetingService.getM(null);
        
        let m = null;
        console.log('create meeting data', dataT.data, dataT.data.length);
        dataT.data.length != 0 && dataT.data.map(v => {
            if(new Date(v.data) == new Date(inputDate)){
                m = "have";
            }
        });
        if(m == "have") {
            console.log("err 1");
            return false;
        }
        else if(inputCustomer == "" || inputTitle == "" || inputDate == ""){
            console.log("err 2");return false;
        }

        const data = {
            title: inputTitle,
            customer: inputCustomer,
            date: inputDate,
            status: true,
            text: inputText,
            newborn: newborn,
        } 
        const response = window.confirm("האם אתה בטוח ביצירת פגישה זה?");
        if (!response) {
            alert("לא נשמר הפגישה");
            return;
        }
        const created = await meetingService.createM(data);
        if(created.err){
            alert(created.msg);
            return;
        }
        let meetings= await meetingService.getM();
        console.log("meetings change", meetings.data);
        props.setMeetings(meetings.data);
        props.toggleModal();
    }

    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(()=>{
        console.log("customers",customers, "isLoading", isLoading);
        
    },[customers,isLoading]);
    const getAllCustomer = async()=>{
        try{
            setIsLoading(true);
            let c = await customerService.getC(null);
            console.log("data",c.data);
            setCustomers(c.data);
        }
        catch(err){
            console.log("error with get customers " + err)
        }
    }
    useEffect(()=>{
        getAllCustomer();
    },[])
    return(
        <>
        <div>
            <div className='text-center text-7xl'>הוספת פגישה</div>
            <div>
                <div className="cardT">
                    <div>
                        <table style ={{margin: "0 auto"}}>
                            <tr>
                                <th><p>{"כותרת"}</p></th>
                                <td><input type="text" className="form-control" id="inputTitle" placeholder="כותרת" value={inputTitle} onChange={e => setInputTitle(e.target.value)}/></td>
                            </tr>
                            <tr>
                                <th><p>{"לקוח"}</p></th>
                                <td>
                                    <select className="form-control" placeholder="בחר לקוח" value={inputCustomer} onChange={e => setInputCustomer(e.target.value)}>
                                        <option>  בחר לקוח  </option>
                                        {customers && customers.map((c) => {return <option>{c.id + " " + c.firstname+ " " + c.lastname}</option>})}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th><p>{"תאריך פגישה"}</p></th>
                                <td><input type='datetime-local' placeholder="dd/mm/yyyy hh:mm" className="form-control" value={inputDate} onChange={e => setInputDate(e.target.value)}/></td>
                            </tr>
                            <tr>
                                <th><p><input onClick={handleClick} checked={newborn} type="checkbox" />ניובורן</p></th>
                            </tr>
                            <tr>
                                <th><p>{"הערה"}</p></th>
                                <td><input type='text' className="form-control" value={inputText} onChange={e => setInputText(e.target.value)}/></td>
                            </tr>
                        </table>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{backgroundColor:"#19f22c"}} onClick={createMeeting}>שמור</button>
                </div>
            </div>
        </div>
        </>
    );
}

export default CreateMeetingModal;