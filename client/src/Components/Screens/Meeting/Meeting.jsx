import React, { useContext, useState, useEffect } from 'react';
import { Trash, PencilSquare, PersonPlusFill, Calendar2DateFill, Calendar2CheckFill, FileEarmarkPlusFill} from 'react-bootstrap-icons';
import {customerService} from '../../../servises/customers.service';
import "./Meeting.css";
import { meetingService } from '../../../servises/meetings.service';
import CreateMeeting from './CreateMeeting';
import UpdateMeeting from './UpdateMeeting';


const Meeting = () => {
    const [meetings, setMeetings] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        getAllMeeting();
    };
 
    const handleOpen = () => {
        setOpen(true);
    };

    const [search, setSearch] = useState("");
    useEffect(()=>{
        getAllMeeting();
    },[search])
    const getAllMeeting = async()=>{
        try{
            let m = await meetingService.getM(null);
            let newM = [];

            m.data.map((item)=>{
                let c = "";
                customers.map(cc=>{
                    console.log("cc",cc._id, item.customer);
                    if(cc._id == item.customer){
                        c = cc;
                    }
                })
                console.log("c",c)
                const date = new Date(new Date(item?.date).getHours() + 3)
                console.log("dates1",c);
                if(item?.title?.includes(search) || c.firstname?.includes(search) || c.lastname?.includes(search)|| (new Date(item.date)).toString().includes(search) || item?.text?.includes(search)){
                    newM = [...newM, item];
                    console.log("newM",newM);
                }
            })
            console.log("search", search, m.data, newM);
            if(search != "")
                setMeetings(newM);
            else setMeetings(m.data);
            }
        catch(err){
            alert("error with get meeting " + err)
        }
    }
    const getAllCustomer = async()=>{
            try{
                let m = await customerService.getC(null);
                setCustomers(m.data);
                }
            catch(err){
                alert("error with get customers " + err)
            }
    }
    useEffect(()=>{
        getAllMeeting();
        getAllCustomer();
    },[])

    const [selectedM, setSelectedM] = useState(null);

    const updateScreen = async(m)=>{
        console.log("m => ", m)
        setSelectedM(m);
    }
    useEffect(()=>{
        getAllCustomer();
    },[])
    return(
    <div className='responsive-container'>
        <h1 className='title'>רשימת פגישות</h1>
        <input type="search" name="s" value={search} onChange={(e)=> {setSearch(e.target.value)}}/>
        <table>
            <thead>
                <tr>
                    {/* <th>#</th> */}
                    <th>כותרת</th>
                    <th>לקוח</th>
                    <th>תאריך</th>
                    <th>סוג צילום</th>
                    {/* <th>הערה</th> */}
                    <th>פעולות</th>
                </tr>
            </thead>
            <tbody>
            {
                meetings && meetings.map((m,i)=> {
                    const d = new Date(m.date);
                    var month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = '' + d.getFullYear(),
                    hh = '' + d.getHours(),
                    mm = '' + d.getMinutes();
                    month = (month.length < 2 ? '0' : '') + month;
                    day = (day.length < 2 ? '0' : '') + day;
                    hh = (hh.length < 2? '0':'') + hh;
                    mm = (mm.length < 2?'0':'')+mm;
                    const date = [hh,mm].join(':') + " " +[year, month, day].join('-');
                    let name = "", type = "";

                    switch(m.type){
                        case 1: type="ניובורן";break;
                        case 2: type="גיל שנה";break;
                        case 3: type= m.text ;break;
                        default: type= m.text ;break;
                    }
                    customers.map((item)=> {
                        if(item._id == m.customer)
                            name = item.firstname + " " + item.lastname;
                    });

                    return(
                        <tr key={i}>
                            {/* <td data-th="#">{i+1}</td> */}
                            <td data-th="כותרת">{m.title}</td>
                            <td data-th="לקוח">{name}</td>
                            <td data-th="תאריך" dir='rtl'>{date}</td>
                            <td date-th="סוג צילום">{type}</td>
                            <td className='same-line'>
                                <ul className="flex relative">
                                    <Trash className="toClick"  size={20} onClick={async()=>{await meetingService.deleteM(m._id); let getall= await meetingService.getM();setMeetings(getall.data);}}/>
                                    <PencilSquare className='toClick' size={20} onClick={()=>{handleOpen(); updateScreen(m);}} />                                        
                                </ul>
                                <ModalC isOpen={open} onClose={handleClose}>
                                    <div className='responsive-container'>
                                    <button className="btn warning" onClick={handleClose}>יציאה</button>
                                        <UpdateMeeting customers={customers} meetings={meetings} setMeetings={setMeetings} handleClose={handleClose} data={selectedM}/>
                                    </div>
                                </ModalC> 
                                
                            </td>
                        </tr>
                    )
                })
            }
            <CreateMeeting customers={customers} meetings={meetings} setMeetings={setMeetings}/>
            </tbody>
        </table>
    </div>)
}

const ModalC = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    // useEffect(()=>{
    //     if(isOpen)
    //         document.getElementById("div-modal").focus();
    //     // else return null;
    // },[])
 
    return (
        <div id="div-modal"
        onKeyDown={(e)=> {console.log("key", e.key);if (e.key === "Escape") {onClose();}}}            
        tabIndex="1"
        style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                onKeyDown={(e)=> {console.log("key", e.key);if (e.key === "Escape") {onClose();}}}
                tabIndex={1}
                style={{
                    // background: "white",
                    // height: 150,
                    // width: 240,
                    margin: "auto",
                    padding: "2%",
                    // border: "2px solid #000",
                    borderRadius: "10px",
                    // boxShadow: "2px solid black",
                }}
            >
                <button className="btn warning" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Meeting;