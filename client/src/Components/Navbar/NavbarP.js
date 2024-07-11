import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const NavbarP = (props) => {
  const Menus = [
    {name: "לקוחות", iconClose:"clipboard-outline", iconOpen: "folder-open-outline", url: "/customer"},
    {name: "פגישות", iconClose:"calendar-outline", iconOpen: "calendar-clear-outline", url: "/meeting"},
    // {name: "מבצעים", iconClose: "document-text-outline", iconOpen: "document-outline", url: ""},
  ]

  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  useEffect(()=>{console.log(`menu[${active}].url ==> ${Menus[active].url}`); navigate(Menus[active].url);},[active]);
  return(
    <div className="flex px-3 items-center fixed inset-x-0 bottom-0">
      <div className="max-h-[5rem] w-full rounded-t-xl">
        <ul className="flex relative">
          <span className={`bg-rose-600 border-4 border-gray-900 h-full w-full absolute rounded-full`}></span>
          {
            Menus.map((menu,i)=>(
              <li key={i} className="w-full">
                <a className="flex flex-col justify-center text-center pt-10" onClick={async()=>{await setActive(i)}}>
                  <span className={`text-xl cursor-pointer duration-700 ${i === active && '-mt-6'}`}>
                    {i === active ? <ion-icon name={menu.iconOpen}></ion-icon> :<ion-icon name={menu.iconClose}></ion-icon>}

                  </span> 
                  <span className={`${active === i ? 'translate-y-4 duration-700 opacity-100'
                                    : 'opacity-0 translate-y-0'}`}>{menu.name}</span>
                </a>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default NavbarP;