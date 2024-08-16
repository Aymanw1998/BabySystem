import React, { useContext, useState, useEffect } from 'react';
import { Trash, PencilSquare, PersonPlusFill, CalendarPlus} from 'react-bootstrap-icons';
import {meetingService} from '../../../servises/meetings.service';
import "./Meeting.css";
import Input from "react-phone-number-input/input";
const UpdateMeeting = ({customers = null, meetings= null,setMeetings, handleClose, data}) => {

    const [idU, setIdU] = useState(data._id);
    const [titleU,setTitleU] =useState(data.title);
    const [customerU, setCustomerU] = useState(data.customer);
    const [dateU, setDateU] = useState(data.date);
    const [infoU, setInfoU] = useState(data.text);
    const [typeU, setTypeU] = useState(data.type);
    useEffect(()=> {console.log("U",idU, titleU, customerU, dateU, infoU, typeU)},[idU, titleU, customerU, dateU, infoU, typeU])
    
    useEffect(()=> {
        var theDate = dateU;
        {
            var d = new Date(theDate),
            month = '' + (d.getUTCMonth() + 1),
            day = '' + d.getUTCDate(),
            year = '' + d.getUTCFullYear(),
            hh = '' + d.getUTCHours(),
            mm = '' + d.getUTCMinutes();
            month = (month.length < 2 ? '0' : '') + month;
            day = (day.length < 2 ? '0' : '') + day;
            hh = (hh.length < 2? '0':'') + hh;
            mm = (mm.length < 2?'0':'')+mm;
            //1998-06-23T12:01
            theDate = [year, month, day].join('-') + "T"+[hh,mm].join(':');
        }
        setDateU(theDate);
    },[])
    const updateMeeting = async() => {
        console.log("typeU update", typeU);
        const dataT = await meetingService.getM(null);
        
        let m = null;
        console.log('update meeting data', dataT.data, dataT.data.length);
        dataT.data.length != 0 && dataT.data.map(v => {
            if(v._id != idU && new Date(v.data) == new Date(dateU)){
                m = "have";
            }
        });
        if(m == "have") {
            console.log("err 1");
            return false;
        }
        if(titleU == "" || customerU == "" || dateU == ""){
            alert("אחד מהשדות או יותר ריקים");
            return;
        }


        const data = {
            _id: idU,
            title: titleU,
            customer: customerU,
            date: dateU,
            status: true,
            text: infoU,
            type: parseInt(typeU),
        } 
        const response = window.confirm("האם אתה בטוח בעדכון פגישה זה?");
        if (!response) {
            alert("לא עודכן הפגישה");
            return;
        }
        const created = await meetingService.updateM(idU,data);
        let getall= await meetingService.getM();
        setMeetings(getall.data);
        setIdU(""); setTitleU(""); setCustomerU(""); setDateU(""); setInfoU(""); 
        handleClose();
    }
    return(
        <>
            <h1>עדכון פריט</h1>
            <table>
                <thead>
                    <tr>
                        {/* <th>#</th> */}
                        <th>כותרת</th>
                        <th>לקוח</th>
                        <th>תאריך</th>
                        <th>סוג צילום</th>
                        {typeU ==3 && <th>טקסט חופשי</th>}
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {/* <td></td> */}
                        <td data-th="כותרת"><input type='text' value={titleU} onChange={(e)=>{setTitleU(e.target.value)}}/></td>
                        <td data-th="לקוח">
                            <select className="form-control" placeholder="בחר לקוח" value={customerU} onChange={(e)=>{setCustomerU(e.target.value)} }>
                            {customerU && customers && customers.map((c) => {if(customerU == c.id)return(<option value={c._id}>{c.firstname + " " + c.lastname}</option>)})}
                            {customerU && customers && customers.map((c) => {if(customerU != c.id)return(<option value={c._id}>{c.firstname + " " + c.lastname}</option>)})}
                            </select>
                        </td>
                        <td data-th="תאריך"><input type='datetime-local' placeholder="dd/mm/yyyy hh:mm" className="form-control" value={dateU} onChange={e => setDateU(e.target.value)}/></td>
                        <td data-th="סוג צילום">
                            <select className="form-control" placeholder="בחר סוג צילום" value={typeU} onChange={(e)=>{setTypeU(e.target.value)}}>
                                <option value="1">{"ניובורן"}</option>
                                <option value="2">{"גיל שנה"}</option>
                                <option value="3">{"אחר"}</option>
                            </select>
                        </td>
                        {typeU ==3 &&<td data-th="טקסט חופשי"><input type='text' className="form-control" value={infoU} onChange={e => setInfoU(e.target.value)}/></td>}
                        <td><button className='toClick' onClick={updateMeeting}>אישור שינוי</button></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default UpdateMeeting;