import React, { useEffect,useState } from "react";
import {Image} from 'react-bootstrap';
import { PencilSquare} from 'react-bootstrap-icons';


import addPersonImage from "../../images/person-add.svg"
import addMeetingImage from "../../images/meeting-add.png"

import CreateCustomerModal from "./Customers/CreateCustomerModal";
import UpdateCustomerModal from "./Customers/UpdateCustomerModal";

import CreateMeetingModal from "./Meetings/CreateMeetingModal";
import UpdateMeetingModal from "./Meetings/UpdateMeetingModal";


import {customerService} from '../../servises/customers.service';
import { meetingService } from "../../servises/meetings.service";
import "./Modal.css";

export default function Modal(props) {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const getAllMeeting = async()=>{
    try{
        let c = await meetingService.getM(null);
        console.log("data meetings",c.data);
        props.setMeetings(c.data);
    }
    catch(err){
        console.log("error with get meetings " + err)
    }
}
  const getAllCustomer = async()=>{
    console.log("get all customers");
    try{
        console.log("get all url");
        let c = await customerService.getC(null);
        console.log("get all url out");
        console.log("data",c.data);
        props.setCustomers(c.data);
    }
    catch(err){
        console.log("error with get customers " + err)
    }
  }

  
  useEffect(()=>{
    console.log(`Modal= ${modal}`)
    if(modal) {
      document.body.classList.add('active-modal')
    } else {
      document.body.classList.remove('active-modal')
    }
    console.log("modal is: " + modal + ", option is: " + props.option);
    switch(props.option){
      case "cc": //create customer
        if(modal){
          props.setCustomers(null);
        }
        else{
          getAllCustomer();
        }
        break;
      case "cu": // update customer
        if(modal){
          console.log("cu modal", (props.customers));
          props.customers.push(props.customers.splice(props.customers.indexOf(props.data), 1)[0]);
          console.log("cu modal", props.customers);

        }
        else{
          getAllCustomer();
        }
        break;
        case "mc": //create meeting
        if(modal){
          props.setMeetings(null);
        }
        else{
          getAllMeeting();
        }
        break;
      case "mu": // update meeting
        if(modal){

        }
        else{
          getAllMeeting();
        }
        break;
    }
  },[modal]);

  return (
    <>
      <button onClick={toggleModal}>
            {(props.option == "cc" || props.option == "mc") && <Image src={props.option == "cc" ? addPersonImage: addMeetingImage} width= "20px" height="20px"/>}
            {(props.option == "cu" || props.option == "mu") && <PencilSquare className="toClick" size={40}/>}
            
      </button>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            {   props.option == "cc" && <CreateCustomerModal setCustomers={props.setCustomers} toggleModal={toggleModal}/>}
            {   props.option == "cu" && <UpdateCustomerModal setCustomers={props.setCustomers} data={props.data} toggleModal={toggleModal}/>}
            {   props.option == "mc" && <CreateMeetingModal  setMeetings={props.setMeetings} toggleModal={toggleModal}/> }
            {   props.option == "mu" && <UpdateMeetingModal  setMeetings={props.setMeetings} data={props.data} toggleModal={toggleModal}/>}
          </div>
        </div>
      )}    </>
  );
}