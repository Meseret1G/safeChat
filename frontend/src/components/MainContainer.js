import React from 'react';
import './Style.css'
import SideBar from './SideBar';
// import Users from './Users';
import { Outlet } from 'react-router-dom';
// import ChatArea from './ChatArea';
// import CreateGroup from './CreateGroup';
// import UserAndGroups from './UserAndGroups';

function MainContainer() {
  return (
    <div className="main-container">
      <SideBar/>
      <Outlet/>
      {/* <Welcome/> */}
      {/* <CreateGroup/> */}
      {/* <ChatArea props={conversations[0]}/> */}
      {/* <UserAndGroups/> */}
      {/* <Users/> */}
      {/* <Groups/> */}
    </div>
  )
}

export default MainContainer
