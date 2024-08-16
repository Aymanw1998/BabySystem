import React, {useEffect, useState} from 'react';

import "./header.css"

import IconSystem from "./../../images/icon-system.png"
import nameSystem from "./../../images/name-system.png"
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const Menus = [
        {name: "לקוחות", iconClose:"clipboard-outline", iconOpen: "folder-open-outline", url: "/customer"},
        {name: "פגישות", iconClose:"calendar-outline", iconOpen: "calendar-clear-outline", url: "/meeting"},
    ]
    const [active, setActive] = useState(0);
    const navigate = useNavigate();
    //   useEffect(()=>{console.log(`menu[${active}].url ==> ${Menus[active].url}`); navigate(Menus[active].url);},[active]);
    useEffect(()=>{
        console.log("location", window.location);
        if(window.location.pathname == "/")
            navigate("/customer");
    },[])
	return (
        <header>
            <div className='System'>
                <img className ="nameSystem" src={nameSystem} alt="NAME SYSTEM" />
                <img className="logoSystem" src={IconSystem} alt="LOGO SYSTEM" />
            </div>
            <nav>
                <ul className="flex relative">
                    {
                        Menus.map((menu,i)=>(
                        <li key={i} onClick={()=> {navigate(menu.url)}}>
                            <a onClick={async()=>{await setActive(i)}}>
                                <span>{<ion-icon name={menu.iconClose}></ion-icon>}</span> 
                                <span>{menu.name}</span>
                            </a>
                        </li>))
                    }
                </ul>   
            </nav>
        </header>
	);
}

export default Header;