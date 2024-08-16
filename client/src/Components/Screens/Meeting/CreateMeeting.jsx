import React, { useContext, useState, useEffect } from 'react';
import { Trash, PencilSquare, PersonPlusFill, Calendar2DateFill, Calendar2CheckFill, FileEarmarkPlusFill} from 'react-bootstrap-icons';
import {meetingService} from '../../../servises/meetings.service';
import "./Meeting.css";
import Input from "react-phone-number-input/input";
const CreateMeeting = ({customers = null, meetings = null, setMeetings = null, c = null, handleClose = null}) => {

    const [id, setId] = useState("");
    const [title,setTitle] =useState("");
    const [customer, setCustomer] = useState("");
    const [date, setDate] = useState("");
    const [info, setInfo] = useState("");
    const [type, setType] = useState(1);
    useEffect(()=> {console.log("C",id, title, customer, date, info, type)},[id, title, customer, date, info, type])
    
    useEffect(()=>{
        if(c)
            setCustomer(c.firstname + " " + c.lastname);
    },[])
    const createMeeting = async() => {
        const dataT = await meetingService.getM(null);
        
        let m = null;
        console.log('create meeting data', dataT.data, dataT.data.length);
        dataT.data.length != 0 && dataT.data.map(v => {
            if(v._id != id && new Date(v.data) == new Date(date)){
                m = "have";
            }
        });
        if(m == "have") {
            console.log("err 1");
            return false;
        }
        else if(customer == "" || title == "" || date == ""){
            console.log("err 2");return false;
        }

        const data = {
            title: title,
            customer: customer,
            date: date,
            status: true,
            text: info,
            type: type,
        } 
        console.log("data create",data)
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
        setMeetings && setMeetings(meetings.data);
        handleClose && handleClose();
        
    }
    return(
        <>
            {
                c &&  <tr>
                <th>#</th>
                <th>כותרת</th>
                <th>לקוח</th>
                <th>תאריך</th>
                <th>סוג צילום</th>
                {type ==3 && <th>טקסט חופשי</th>}
                <th>פעולות</th>
            </tr>
            }
        <tr>
            {/* <td></td> */}
            <td data-th="כותרת"><input type='text' value={title} onChange={(e)=>{setTitle(e.target.value)}}/></td>
            <td data-th="לקוח">
                <select className="form-control" placeholder="בחר לקוח" value={customer} onChange={(e)=>{setCustomer(e.target.value)}}>
                    {
                        customers && customers.map((c,i) => {return <option key={i} value={c._id}>{c.firstname + " " + c.lastname}</option>})
                    }
                </select>
            </td>
            <td data-th="תאריך"><input type='datetime-local' placeholder="dd/mm/yyyy hh:mm" className="form-control" value={date} onChange={e => setDate(e.target.value)}/></td>
            {type == 3 && <td data-th="טקסט חופשי"><input type='text' className="form-control" value={info} onChange={e => setInfo(e.target.value)}/></td>}
            <td data-th="סוג צילום">
                <select className="form-control" placeholder="בחר סוג צילום" value={type} onChange={(e)=>{setType(e.target.value)}}>
                    <option value="1">{"ניובורן"}</option>
                    <option value="2">{"גיל שנה"}</option>
                    <option value="3">{"אחר"}</option>
                </select>
            </td>
            <td><FileEarmarkPlusFill className='toClick' onClick={createMeeting}/></td>
        </tr>
        </>
    )
}

export default CreateMeeting;