import React, { useContext, useState, useEffect } from 'react';
import { Trash, PencilSquare, PersonPlusFill, CalendarPlus} from 'react-bootstrap-icons';
import {customerService} from '../../../servises/customers.service';
import "./Customer.css";

import Input from "react-phone-number-input/input";
import CreateCustomer from './CreateCustomer';
import UpdateCustomer from './UpdateCustomer';
import CreateMeeting from '../Meeting/CreateMeeting';


const Customer = () => {
    const [customers, setCustomers] = useState([]);

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        getAllCustomer();
    };
 
    const handleOpen = () => {
        setOpen(true);
    };

    const [open2, setOpen2] = useState(false);
    const handleClose2 = () => {
        setOpen2(false);
        getAllCustomer();

    };
 
    const handleOpen2 = () => {
        setOpen2(true);
    };
    const [search, setSearch] = useState("");
    useEffect(()=>{
        getAllCustomer();
    },[search])
    const getAllCustomer = async()=>{
        try{
            let c = await customerService.getC(null);
            let newC = [];
            c.data.map(item=>{
                console.log(item.firstname.includes(search))
                if(item.firstname.includes(search) || item.lastname.includes(search) || item.gender.includes(search) || item.phone.includes(search)){
                    newC = [...newC, item];
                }
            })
            console.log("search", search, c.data, newC);
            if(search != "")
                setCustomers(newC);
            else setCustomers(c.data);
            }
        catch(err){
            alert("error with get customers " + err)
        }
    }

    const [selectedC, setSelectedC] = useState(null);

    const updateScreen = async(c)=>{
        console.log("c => ", c)
        setSelectedC(c);
    }
    useEffect(()=>{
        getAllCustomer();
    },[])

    
    return(
    <div className='responsive-container'>
    <h1 className='title'>רשימת לקוחות</h1>
    
    <input type="search" name="s" value={search} onChange={(e)=> {setSearch(e.target.value)}}/>


    <table>
        <thead>
            <tr>
                {/* <th data-th="ת.ז.">#</th> */}
                <th data-th="שם פרטי">שם פרטי</th>
                <th data-th="שם משפחה">שם משפחה</th>
                <th data-th="מין">מין</th>
                <th data-th="מספר טלפון">מספר טלפון</th>
                <th>פעולות</th>
            </tr>
        </thead>
        <tbody>
        {
            customers && customers.map((c,i)=> {
                return(
                    <tr key={i}>
                        {/* <td data-th="#">{i+1}</td> */}
                        <td data-th="שם פרטי">{c.firstname}</td>
                        <td data-th="שם משפחה">{c.lastname}</td>
                        <td data-th="מין">{c.gender}</td>
                        <td data-th="מספר טלפון">{c.phone.replace("+972","0")}</td>
                        <td className='same-line'>
                            <ul className="flex relative">
                                <Trash className="toClick"  size={20} onClick={async()=>{await customerService.deleteC(c.id); let getall= await customerService.getC();setCustomers(getall.data);}}/>
                                <PencilSquare className='toClick' size={20} onClick={()=>{handleOpen(); updateScreen(c);}}/>
                                <CalendarPlus className='toClick' size={20} onClick={()=>{handleOpen2(); updateScreen(c);}}/>
                            </ul>
                            <ModalC isOpen={open} onClose={handleClose}>
                                <div className='responsive-container'>
                                    <button className="btn warning" onClick={handleClose}>יציאה</button>
                                    <UpdateCustomer customers={customers} setCustomers={setCustomers} handleClose={handleClose} data={selectedC} />
                                </div>
                            </ModalC>
                            <ModalC isOpen={open2} onClose={handleClose2}>
                                <div className='responsive-container'>
                                    <button className="btn warning" onClick={handleClose2}>יציאה</button>
                                    <CreateMeeting customers={customers} c={selectedC}/>
                                </div>
                            </ModalC>

                        </td>
                    </tr>
                )
            })
        }
        <CreateCustomer customers={customers} setCustomers={setCustomers}/>
        </tbody>
    </table>
    </div>)
}

const ModalC = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

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

export default Customer;