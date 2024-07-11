import React, { Fragment, useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter,} from 'react-router-dom';

import NavbarP from './Components/Navbar/NavbarP';
import Header from './Components/Header/Header';
import Customer from './Components/Screens/Customer/Customer';
import Meeting from './Components/Screens/Meeting/Meeting';
import Modal from './Components/Modals/Modal';
function App(props) {
  // const location = useLocation();

  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/customer' element={<Customer/>}/>
          <Route path='/meeting' element={<Meeting/>}/>
        </Routes>
        <NavbarP/>
      </BrowserRouter>
    </>
    
  );
}

export default App;
