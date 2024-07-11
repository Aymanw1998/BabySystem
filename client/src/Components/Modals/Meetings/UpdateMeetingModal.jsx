import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate} from 'react-router-dom';
import {meetingService} from '../../../servises/meetings.service';
import { customerService } from '../../../servises/customers.service';
import Input from "react-phone-number-input/input";
import {Image} from 'react-bootstrap';
import addMeetingImage from "../../../images/meeting-add.png"

const UpdateMeetingModal = (props) => {

    const [inputID,setInputID] = useState("");
    const [inputCustomer, setInputCustomer] = useState("");
    const [inputTitle, setInputTitle] = useState("");
    const [inputDate, setInputDate] = useState("");
    const [inputStatus, setInputStatus] = useState("");
    const [inputText, setInputText] = useState("");
    const [newborn, setNewborn] = useState("");
    const handleClick = () => setNewborn(!newborn)


    useEffect(()=>{
        console.log("UpdateMeetingModel", props.data);
        if(props.data){
            setInputID(props.data.id);
            setInputCustomer(props.data.customer);
            setInputTitle(props.data.title);
            var theDate = props.data.date;
                {
                    var d = new Date(props.data.date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = '' + d.getFullYear(),
                    hh = '' + d.getHours(),
                    mm = '' + d.getMinutes();
                    month = (month.length < 2 ? '0' : '') + month;
                    day = (day.length < 2 ? '0' : '') + day;
                    hh = (hh.length < 2? '0':'') + hh;
                    mm = (mm.length < 2?'0':'')+mm;
                    //1998-06-23T12:01
                    theDate = [year, month, day].join('-') + "T"+[hh,mm].join(':');
                }
            setInputDate(theDate);
            setInputStatus(props.data.status);
            setInputText(props.data.text);
            setNewborn(props.data.newborn);
        }
    },[])

    const updateMeeting = async() => {
        const dataT = await meetingService.getM(inputID);
        if(inputCustomer == "" || inputTitle == "" || inputDate == ""){
            console.log("err 2");return false;
        }

        const data = {
            _id: inputID,
            title: inputTitle,
            customer: inputCustomer,
            date: inputDate,
            status: true,
            text: inputText,
            newborn: newborn,
        } 
        const response = window.confirm("האם אתה בטוח בעדכון פגישה זה?");
        if (!response) {
            alert("לא נשמר השינוי");
            return;
        }
        const created = await meetingService.updateM(data._id,data);
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
            <h1 className='text-center text-7xl'>עדכון פגישה</h1>
            <div>
                <div className="cardT">
                    <div>
                        <table style ={{margin: "0 auto"}}>
                        <tr>
                                <th><p>{"מזהה"}</p></th>
                                <td><input type="text" className="form-control" id="inputID" placeholder="209138155" value={inputID} onChange={e => setInputID(e.target.value)} disabled/></td>
                            </tr>
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
                            <th><p><input onClick={handleClick} checked={newborn} type="checkbox" />ניובורן</p></th>
                            <tr>
                                <th><p>{"הערה"}</p></th>
                                <td><input type='text' className="form-control" value={inputText} onChange={e => setInputText(e.target.value)}/></td>
                            </tr>
                        </table>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{backgroundColor:"#19f22c"}} onClick={updateMeeting}>שמור</button>
                </div>
            </div>
        </div>
        </>
    );
}

export default UpdateMeetingModal;