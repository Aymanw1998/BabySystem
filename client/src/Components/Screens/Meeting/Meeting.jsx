import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {Container,Text, Image,} from 'react-bootstrap';
import { Trash, PencilSquare} from 'react-bootstrap-icons';

import meetingImage from "../../../images/meeting.png";
import searchImage from "../../../images/search.png"

import {meetingService} from '../../../servises/meetings.service';
import Modal from '../../Modals/Modal';
import "./Meeting.css";

const Card = (props) => {
    let [date, setDate] = useState("");

    const navigate = useNavigate();
    console.log("card props", props);
    const dataMeeting = {
        id: props.id,
        title: props.title,
        customer: props.customer,
        date: props.date,
        status: props.status,
        text: props.text,
        newborn: props.newborn,
    }
    useEffect(()=>{
        var d = new Date(props.date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = ''+d.getFullYear(),
        hh = d.getHours(),
        mm = d.getMinutes(); 

        month = (month.length < 2 ? '0' : '') + month;
        day = (day.length < 2 ? '0' : '') + day;
        hh = (hh < 10 ? '0' : '') + hh;
        mm = (mm < 10 ? '0' : '') + mm;
        dataMeeting.date = day + "/" + month + "/" +year + " " + hh + ":" + mm;
        setDate(day + "/" + month + "/"+year + " " + hh + ":" + mm);
        console.log("data card", dataMeeting);
    },[])
    return (
    <div className="body">
        <div className="card">
            <div className="top">
                <h2 className="name">{dataMeeting.title}</h2>
            </div>
            <table dir="ltr" className="bottom">
                <tr>
                    <td><p>{dataMeeting.id}</p></td>
                    <th><p>{"מזהה פגישה"}</p></th>
                </tr>
                <tr>
                    <td><p>{dataMeeting.customer}</p></td>
                    <th><p>{"לקוח"}</p></th>
                </tr>
                <tr>
                    <td><p>{date}</p></td>
                    <th><p>{"תאריך פגישה"}</p></th>
                </tr>
                {/* <tr>
                    <td><p>{!dataMeeting.status ? "קיים" : "בוטל"}</p></td>
                    <th><p>{"סטטוס"}</p></th>
                </tr> */}
                <tr>
                    <td><p>{dataMeeting.text}</p></td>
                    <th><p>{"הערה"}</p></th>
                </tr>
            </table>
            <div className="flex relative right-10 px-10">
                <Trash className="toClick"  size={40} onClick={async()=>{await meetingService.deleteM(dataMeeting.id); navigate(0)}}/>
                <Modal option={"mu"} setMeetings={props.setMeetings} data={dataMeeting}/>
            </div>
        </div>
    </div>
    );
  }

const Meeting = () => {
    const [modalShow, setModalShow] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    let [inputMeetingOptions,setInputMeetingOptions] = useState("");
    let [inputMeetingType,setInputMeetingType] = useState("");
        
    useEffect(() => {
        console.log("inputMeetingOptions", inputMeetingOptions);
        console.log("inputMeetingType", inputMeetingType);
    },[inputMeetingOptions,inputMeetingType]);
    useEffect(()=>{console.log(`modelShow=${modalShow}, fullscreen=${fullscreen}`)},[modalShow, fullscreen])
    const [meetings, setMeetings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputSearch, setInputSearch] = useState([]);
    useEffect(()=>{
        console.log("meetings",meetings, "isLoading", isLoading);
        //getAllMeeting();
    },[meetings,isLoading]);

    useEffect(()=>{},[inputSearch]);

    const createCard = (meeting) =>{
        console.log("create card meeting", meeting);
        if(inputSearch != ""){
            var str = (meeting.id +" " + meeting.title + " " + meeting.customer + " " + meeting.date + " " + meeting.status + " " + meeting.text);
            if(!str.includes(inputSearch))
                return
        }
        return (
        <Card
            id={meeting._id}
            title={meeting.title}
            customer={meeting.customer}
            date={meeting.date}
            status={meeting.status}
            text={meeting.text}
            newborn = {meeting.newborn}
            setMeetings={setMeetings}
        />
        );
        }
    const getAllMeeting = async()=>{
        try{
            setIsLoading(true);
            let c = await meetingService.getM(null);
            console.log("data meetings",c.data);
            setMeetings(c.data);
        }
        catch(err){
            console.log("error with get meetings " + err)
        }
    }
    
    useEffect(()=>{
        getAllMeeting();
    },[])
return(
    <div className='body'>
        <div align="center" justify="center">
            <h1 className='TitleScreen'>רשימת פגישות
                <Image src={meetingImage} width='150px' height='150px' />
            </h1>
        </div>
        <div className="col-auto">
            <div className="input-group">
                <div className="input-group-prepend">
                    <div className="input-group-text"><Image src={searchImage} width='50px' height='50px'/></div>
                    <input type="text" className="form-control" value={inputSearch} onChange={e => setInputSearch(e.target.value)} placeholder="חפש פגישות" />
                    <Modal option={"mc"} setMeetings={setMeetings}/>
                </div>
            </div>
        </div>
        <div>
            <aside>
                <h5>פילטר על פי:</h5>
                <b>תוקף</b>
                <select className="form-control" value={inputMeetingOptions} onChange={e => setInputMeetingOptions(e.target.value)}>
                    <option value="">הכל</option>
                    <option value="future">עתידיות</option>
                    <option value="past">ישנות</option>
                </select>
                <br/>
                <b>סוג</b>
                <select className="form-control" value={inputMeetingType} onChange={e => setInputMeetingType(e.target.value)}>
                    <option value="">הכל</option>
                    <option value="newborn">ניובורן</option>
                    <option value="normal">רגיל</option>
                </select>
            </aside>
            
            {meetings && meetings.map((m) => {
                const d = new Date(m.date);
                const now = new Date(Date.now());
                console.log("neetings list",inputMeetingOptions, inputMeetingType, m,now, d);
                if(inputMeetingType == "") {
                    if((inputMeetingOptions == "future" && d >= now || (inputMeetingOptions == "past" && d < now))) {
                        return createCard(m)
                    }
                    else if(inputMeetingOptions == ""){
                        return createCard(m)
                    }
                }
                else if(inputMeetingType == "newborn" && m.newborn == true) {
                    if((inputMeetingOptions == "future" && d >= now || (inputMeetingOptions == "past" && d < now))) {
                        return createCard(m)
                    }
                    else if(inputMeetingOptions == ""){
                        return createCard(m)
                    }
                }
                else if(inputMeetingType == "normal" && m.newborn == false) {
                    if((inputMeetingOptions == "future" && d >= now || (inputMeetingOptions == "past" && d < now))) {
                        return createCard(m)
                    }
                    else if(inputMeetingOptions == ""){
                        return createCard(m)
                    }
                }
            }    
            )
            }
        </div>
    </div>
);
}

export default Meeting;