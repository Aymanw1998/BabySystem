import React, { useContext, useState, useEffect } from 'react';
import { Trash, PencilSquare, PersonPlusFill, CalendarPlus} from 'react-bootstrap-icons';
import {customerService} from '../../../servises/customers.service';
import "./Customer.css";
import Input from "react-phone-number-input/input";
const UpdateCustomer = ({customers = null, setCustomers, handleClose, data}) => {

    const [idU, setIdU] = useState(data.id);
    const [firstnameU,setFirstnameU] =useState(data.firstname);
    const [lastnameU, setLastnameU] = useState(data.lastname);
    const [genderU, setGenderU] = useState(data.gender);
    const [phoneU, setPhoneU] = useState(data.phone);
    useEffect(()=>{console.log(`customer:`, data );console.log(`id:${idU},fn:${firstnameU},ln:${lastnameU},gender:${genderU},phone:${phoneU}`)},[idU, firstnameU, lastnameU, genderU, phoneU])
    const updatePerson = async() => {
        if(firstnameU == "" || lastnameU == "" || genderU == "" || phoneU == ""){
            alert("אחד מהשדות או יותר ריקים");
            return;
        }
        else if(phoneU.length !== ("+972508241000").length && phoneU.length !== ("+97282410001").length ){
            alert("מספר הטלפון שגוי");
            return;
        }

        const data = {
            id: idU,
            firstname: firstnameU,
            lastname: lastnameU,
            phone: phoneU,
            gender: genderU,
        } 
        alert("data=> id:"+data.id+", fn:"+data.firstname+", ln:" + data.lastname+", phone:" + data.phone+", gender:"+data.gender) 
        const response = window.confirm("האם אתה בטוח בעדכון לקוח זה?");
        if (!response) {
            alert("לא עודכן הלקוח");
            return;
        }
        const created = await customerService.updateC(idU,data);
        let getall= await customerService.getC();
        console.log("customers change", getall.data);
        setCustomers(getall.data);
        handleClose();
        setIdU(""); setFirstnameU(""); setLastnameU(""); setPhoneU(""); setGenderU("זכר");
    }
    return(
        <>
            <h1>עדכון פריט</h1>
            <table>
                <thead>
                    <tr>
                        {/* <th data-th="ת.ז.">#</th> */}
                        <th data-th="שם פרטי">שם פרטי</th>
                        <th data-th="שם משפחה">שם משפחה</th>
                        <th data-th="מין">מין</th>
                        <th data-th="מספר טלפון">מספר טלפון</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {/* <td></td> */}
                        <td data-th="שם פרטי"><input type='text' value={firstnameU} onChange={(e)=>{setFirstnameU(e.target.value)}}/></td>
                        <td data-th="שם משפחה"><input type="text" value={lastnameU} onChange={(e)=>{setLastnameU(e.target.value)}}/></td>
                        <td data-th="מין">
                            <select className="form-control" placeholder="בחר מין" value={genderU} onChange={(e)=>{setGenderU(e.target.value)}}>
                                <option>זכר</option>
                                <option>נקבה</option>
                            </select>
                        </td>
                        <td data-th="מספר טלפון"><Input className="form-control" country="IL" id="inputPhone" dir="rtl" placeholder="מספר טלפון" value={phoneU} onChange={setPhoneU}/></td>
                        <td><button className='toClick' onClick={updatePerson}>אישור שינוי</button></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default UpdateCustomer;