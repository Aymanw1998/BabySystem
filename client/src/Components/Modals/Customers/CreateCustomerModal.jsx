import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate} from 'react-router-dom';
import  profileImage from '../../../images/profile.jpg';
import {customerService} from '../../../servises/customers.service';
import Input from "react-phone-number-input/input";
const CreateCustomerModal = (props) => {
    const [modalShow, setModalShow] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    const [inputImageProfile, setInputImageProfile]=useState(profileImage);
    const [fileImageProfile, setFileImageProfile] = useState();
    const [inputFirstname, setInputFirstname] = useState("");
    const [inputLastname, setInputLastname] = useState("");
    const [inputID, setInputID] = useState("");
    const [inputPhone, setInputPhone] = useState("");
    const [inputGender, setInputGender] = useState("");
    const [inputDate, setInputDate] = useState("");


    useEffect(()=>{
        console.log(`modelShow=${modalShow},fullscreen=${fullscreen}`);
        if(modalShow == false){
            setInputImageProfile(profileImage);
            setFileImageProfile();
            setInputFirstname("");
            setInputLastname("");
            setInputID("");
            setInputPhone("");
            setInputGender("");
            setInputDate("");
        }
    },[modalShow, fullscreen])
    useEffect(()=>{
        //console.log(inputImageProfile);
        //console.log(`create ID= ${inputID}, firstname= ${inputFirstname}, lastname= ${inputLastname}, phone= ${inputPhone}, gender= ${inputGender}, date=${inputDate}`);
    },[inputFirstname, inputLastname, inputPhone, inputGender, inputImageProfile, inputDate]);

    const createCustomer = async() => {
        console.log("create user", inputPhone )
        const dataT = await customerService.getC(inputID);
        const dataCustomer = dataT.data._id;
        console.log("dataCustomr",dataCustomer, dataCustomer);
        if(inputID == "" || inputID.length !== 9 || dataCustomer) {
            console.log("err 1");
            return false;
        }
        else if(inputFirstname == "" || inputLastname == "" || inputGender == "סוג מין" || inputPhone == ""){
            console.log("err 2");return false;
        }
        else if(inputPhone.length !== ("+972508241000").length && inputPhone.length !== ("+97282410001").length ){
            console.log("err 3");return false;
        }

        const data = {
            id: inputID,
            firstname: inputFirstname,
            lastname: inputLastname,
            phone: inputPhone,
            gender: inputGender,
            date: inputDate,
        } 
        const response = window.confirm("האם אתה בטוח ביצירת לקוח זה?");
        if (!response) {
            alert("לא נשמר הלקוח");
            return;
        }
        const created = await customerService.createC(data);
        setModalShow(false);
        
        let customers= await customerService.getC();
        console.log("customers change", customers.data);
        props.setCustomers(customers.data);
        props.toggleModal();

    }
    return(
        <>
        <div>
            <h1 className='text-center'>הוספת לקוח</h1>
            <div>
                <div className="cardT">
                    <div>
                        <table style ={{margin: "0 auto"}}>
                            <tr>
                                <th><p>{"תעודת זיהות"}</p></th>
                                <td><input type="text" className="form-control" id="inputID" placeholder="209138155" value={inputID} onChange={e => setInputID(e.target.value)}/></td>
                            </tr>
                            <tr>
                                <th><p>{"שם פרטי"}</p></th>
                                <td><input type="text" className="form-control" id="inputFirstname" placeholder="שם פרטי" value={inputFirstname} onChange={e => setInputFirstname(e.target.value)}/></td>
                            </tr>
                            <tr>
                                <th><p>{"שם משפחה"}</p></th>
                                <td><input type="text" className="form-control" id="inputlastname" placeholder="שם משפחה" value={inputLastname} onChange={e => setInputLastname(e.target.value)}/></td>
                            </tr>
                            <tr>
                                <th><p>{"מספר טלפון"}</p></th>
                                <td><Input className="form-control" country="IL" id="inputPhone" dir="rtl" placeholder="מספר טלפון" value={inputPhone} onChange={setInputPhone}/></td>
                            </tr>
                            <tr>
                                <th><p>{"מין"}</p></th>
                                <td>
                                    <select className="form-control" placeholder="בחר מין" value={inputGender} onChange={e => setInputGender(e.target.value)}>
                                        <option>  סוג מין  </option>
                                        <option>זכר</option>
                                        <option>נקבה</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th><p>{"תאריך לידה"}</p></th>
                                <td><input type='date' placeholder="dd/mm/yyyy" className="form-control" value={inputDate} onChange={e => setInputDate(e.target.value)}/></td>
                            </tr>
                        </table>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{backgroundColor:"#19f22c"}} onClick={createCustomer}>שמור</button>
                </div>
            </div>
        </div>
        </>
    );
}

export default CreateCustomerModal;