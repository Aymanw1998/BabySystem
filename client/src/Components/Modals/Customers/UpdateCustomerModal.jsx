import React, { useEffect, useState } from 'react';
import  profileImage from '../../../images/profile.jpg';
import {customerService} from '../../../servises/customers.service';
import Input from "react-phone-number-input/input";
import { useNavigate } from 'react-router-dom';
import { PencilSquare} from 'react-bootstrap-icons';

const UpdateCustomerModal = (props) => {
    const navigate = useNavigate();

    const [inputFirstname, setInputFirstname] = useState("");
    const [inputLastname, setInputLastname] = useState("");
    const [inputID, setInputID] = useState("");
    const [inputPhone, setInputPhone] = useState("");
    const [inputGender, setInputGender] = useState("");
    const [inputDate, setInputDate] = useState("");
    const [isFill, setIsFill] = useState(false);
    useEffect(()=> {
        console.log("UpdateCustomerModel", props.data);
        if(props.data)
        {
            setIsFill(false);
            setInputFirstname(props.data.firstname);
            setInputLastname(props.data.lastname);
            setInputID(props.data.id);
            setInputPhone(props.data.phone);
            var theDate = props.data.date;
                {
                    var d = new Date(props.data.date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
                    month = (month.length < 2 ? '0' : '') + month;
                    day = (day.length < 2 ? '0' : '') + day;
                    theDate = [year, month, day].join('-');
                }
            setInputDate(theDate);
            setInputGender(props.data.gender);
            setIsFill(true);
        }
    },[]);
    useEffect(()=>{
        console.log(`inputDate= ${inputDate}`);
    },[inputDate])
    useEffect(()=>{
        console.log(`isFill= ${isFill}, create ID= ${inputID}, firstname= ${inputFirstname}, lastname= ${inputLastname}, phone= ${inputPhone}, gender= ${inputGender}, date=${inputDate}`);
    },[isFill]);

    const updateCustomer = async() => {
        const dataT = await customerService.getC(inputID);
        const dataCustomer = dataT.data._id;
        console.log("dataCustomr",dataCustomer, dataCustomer);
        if(inputID == "" || inputID.length !== 9 || !dataCustomer) {
            console.log("err 1");
            return false;
        }
        else if(inputFirstname == "" || inputLastname == "" || inputGender == "סוג מין" || inputPhone == ""){
            console.log("err 2");
            return false;
        }
        else if(inputPhone.length !== ("+972508241000").length && inputPhone.length !== ("+97282410001").length){
            console.log("err 3");
            return false;
        }

        const data = {
            id: inputID,
            firstname: inputFirstname,
            lastname: inputLastname,
            phone: inputPhone,
            gender: inputGender,
            date: inputDate,
        } 
        console.log("data Update", data);
        const response = window.confirm("האם אתה בטוח בשינוי?");
        if (!response) {
            alert("לא נשמר שינוי");
            return;
        }
        const update = await customerService.updateC(inputID,data);
        let customers = await customerService.getC();
        props.setCustomers(customers.data);
        alert("השינוי הרצוי נשמר");
        props.toggleModal();

    }
    return(
        <>
        <div>
            <h1 className='text-center'>עדכון פרטי איש הקשר</h1>
            <div>
                <div className="cardT">
                    
                    <div>
                        <table style ={{margin: "0 auto"}}>
                            <tr>
                                <th><p>{"תעודת זיהות"}</p></th>
                                <td><input type="text" className="form-control" id="inputID" placeholder="209138155" value={inputID} onChange={e => setInputID(e.target.value)} disabled/></td>
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
                    <button type="submit" className="btn btn-primary toClick" style={{backgroundColor:"#d3ff00"}} onClick={updateCustomer}>עדכון</button>
                </div>
        </div>
        </div>
      </>
    );
}

export default UpdateCustomerModal;