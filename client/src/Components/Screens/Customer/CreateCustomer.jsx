import React, { useContext, useState, useEffect } from 'react';
import { Trash, PencilSquare, PersonPlusFill, CalendarPlus} from 'react-bootstrap-icons';
import {customerService} from '../../../servises/customers.service';
import "./Customer.css";
import Input from "react-phone-number-input/input";
const CreateCustomer = ({customers = null, setCustomers}) => {

    const [id, setId] = useState("");
    const [firstname,setFirstname] =useState("");
    const [lastname, setLastname] = useState("");
    const [gender, setGender] = useState("זכר");
    const [phone, setPhone] = useState("");
    useEffect(()=>{console.log(`id:${id},fn:${firstname},ln:${lastname},gender:${gender},phone:${phone}`)},[id, firstname, lastname, gender, phone])
    const createPerson = async() => {
        const min = 100000000;
        const max = 999999999;
        let idC = 0;// Math.random() * (max - min) + min;
        let b = false;
        do {
            b = false;
            idC = Math.random() * (max - min) + min;
            customers.map((c)=>{
                if(c.id == idC){
                    b = true;
                }
            })
        }while(b);

        if(firstname == "" || lastname == "" || gender == "" || phone == ""){
            alert("אחד מהשדות או יותר ריקים");
            return;
        }
        else if(phone.length !== ("+972508241000").length && phone.length !== ("+97282410001").length ){
            alert("מספר הטלפון שגוי");
            return;
        }

        const data = {
            id: parseInt(idC),
            firstname: firstname,
            lastname: lastname,
            phone: phone,
            gender: gender,
        } 
        alert("data=> id:"+data.id+", fn:"+data.firstname+", ln:" + data.lastname+", phone:" + data.phone+", gender:"+data.gender) 
        const response = window.confirm("האם אתה בטוח ביצירת לקוח זה?");
        if (!response) {
            alert("לא נשמר הלקוח");
            return;
        }
        const created = await customerService.createC(data);
        let getall= await customerService.getC();
        console.log("customers change", getall.data);
        setCustomers(getall.data);
        setId(""); setFirstname(""); setLastname(""); setPhone(""); setGender("זכר");
    }
    return(
        <tr>
                {/* <td></td> */}
                {/* <td data-th="ת.ז."><input type='text' inputMode='numeric' autocomplete="cc-number" minLength={9} maxLength={9} value={id} onChange={(e)=> {setId(e.target.value)}}/></td> */}
                <td data-th="שם פרטי"><input type='text' value={firstname} onChange={(e)=>{setFirstname(e.target.value)}}/></td>
                <td data-th="שם משפחה"><input type="text" value={lastname} onChange={(e)=>{setLastname(e.target.value)}}/></td>
                <td data-th="מין">
                    <select className="form-control" placeholder="בחר מין" value={gender} onChange={(e)=>{setGender(e.target.value)}}>
                        <option>זכר</option>
                        <option>נקבה</option>
                    </select>
                </td>
                <td data-th="מספר טלפון"><Input className="form-control" country="IL" id="inputPhone" dir="rtl" placeholder="מספר טלפון" value={phone} onChange={setPhone}/></td>
                <td><PersonPlusFill className='toClick' onClick={createPerson}/></td>
        </tr>
    )
}

export default CreateCustomer;