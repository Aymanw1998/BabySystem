import React, { useContext, useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

import Modal from "../../Modals/Modal"
import Button from "react-bootstrap/Button";

import {Container,Text, Image,} from 'react-bootstrap';
import { Trash, PencilSquare} from 'react-bootstrap-icons';

import babyImage from "../../../images/baby.png";
import searchImage from "../../../images/search.png"
import profileImage from "./../../../images/profile.jpg"
import profileBoyImage from "./../../../images/profile-boy.png"
import profileGirlImage from "./../../../images/profile-girl.png"

import {customerService} from '../../../servises/customers.service';

import CreateCustomerModal from "./../../Modals/Customers/CreateCustomerModal";
import UpdateCustomerModal from "./../../Modals/Customers/UpdateCustomerModal"
import "./Customer.css";

const Card = (props) => {
    const navigate = useNavigate();
    const [date, setDate] = useState("");
    const [phone, setPhone] = useState("");
    const dataCustomer = {
        firstname : props.name.split(" ")[0],
        lastname : props.name.substr(props.name.split(" ")[0].length + 1, props.name.length + 1 - props.name.split(" ")[0].length),
        avatar: props.avatar,
        id: props.id,
        phone: props.phone,
        gender: props.gender,
        date: props.date,
    }
    useEffect(()=>{
        var d = new Date(props.date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        month = (month.length < 2 ? '0' : '') + month;
        day = (day.length < 2 ? '0' : '') + day;
        dataCustomer.date = [year, month, day].join('-');
        setDate([day, month, year].join('/'));
        var p = props.phone.split("+972")[1];
        p = p.length == 9 ? p = "0" + p.substr(0,2) + "-" + p.substr(2,3) + "-" + p.substr(5,4) : 
                            p = "0" + p.substr(0,1) + "-" + p.substr(1,3) + "-" + p.substr(4,4);
        console.log("pphone", props.phone, p)
        setPhone(p);
        console.log("data card", dataCustomer);
    },[])
    return (
    <div>
        <div className="card">
            <div className="top">
                <h2 className="name">{props.name}</h2>
                {props.avatar? <img className="circle-img" src={props.avatar} alt="avatar_img" />:<img className="circle-img" src={props.gender == "זכר" ? /*profileImage*/ profileBoyImage : profileGirlImage} alt="avatar_img" />}
            </div>
            <table dir="ltr" className="bottom">
                <tr>
                    <td><p>{props.id}</p></td>
                    <th><p>{"תעודת זיהות"}</p></th>
                </tr>
                <tr>
                    <td><a href={"tel:" + props.phone}><p>{phone}</p></a></td>
                    <th><p>{"מספר טלפון"}</p></th>
                </tr>
                <tr>
                    <td><p>{props.gender}</p></td>
                    <th><p>{"מין"}</p></th>
                </tr>
                <tr>
                    <td><p>{date}</p></td>
                    <th><p>{"תאריך לידה"}</p></th>
                </tr>
            </table>
            <div className="flex relative right-10 px-10">
                <Trash className="toClick"  size={40} onClick={async()=>{await customerService.deleteC(props.id); window.location.reload(); navigate("/customer");}}/>
                <Modal option={"cu"} setCustomers={props.setCustomers} customers={props.customers} data={dataCustomer}/>
                
            </div>
        </div>
    </div>
    );
  }

const Customer = () => {
    const [show, setShow] = useState(false);

    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputSearch, setInputSearch] = useState([]);
    useEffect(()=>{
        console.log("customers",customers, "isLoading", isLoading);
        
    },[customers,isLoading]);

    useEffect(()=>{},[inputSearch]);

    function createCard(contacts) {
        const contact = contacts;
        if(inputSearch != ""){
            var str = (contact.id +" " + contact.firstname + " " + contact.lastname+ " " + contact.phone + " " + contact.gender + " " + contact.avatar)
            if(!str.includes(inputSearch))
                return
        }
        return (
        <Card
            id={contact.id}
            name={contact.firstname + " " + contact.lastname}
            phone={contact.phone}
            gender={contact.gender}
            date={contact.date}
            avatar={contact.avatar}
            setCustomers={setCustomers}
            customers={customers}
        />
        );
        }
    const getAllCustomer = async()=>{
        console.log("get all customers");
        try{
            setIsLoading(true);
            console.log("get all url");
            let c = await customerService.getC(null);
            console.log("get all url out");
            console.log("data",c.data);
            setCustomers(c.data);
            setIsLoading(false);
        }
        catch(err){
            console.log("error with get customers " + err)
        }
    }
    
    useEffect(()=>{
        getAllCustomer();
    },[])
return(
    <div className='body'>
        <div align="center" justify="center">
            <h1 className='TitleScreen'>רשימת לקוחות
                <Image src={babyImage} width='150px' height='150px' />
            </h1>
        </div>
        <div className="col-auto inset-x-0 top-0">
            <div className="input-group">
                <div className="input-group-prepend">
                    <div className="input-group-text"><Image src={searchImage} width='50px' height='50px'/></div>
                    <input type="text" className="form-control" value={inputSearch} onChange={e => setInputSearch(e.target.value)} placeholder="חפש לקוח" />
                    <Modal option={"cc"} setCustomers={setCustomers} customers = {customers}/>
                </div>
            </div>
        </div>
        <div>
            {customers && customers.map((c) => {return createCard(c)})}
        </div>
    </div>
);
}

export default Customer;