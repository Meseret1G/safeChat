import React from 'react';
import './Style.css';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import { IconButton } from "@mui/material";
import ConversationItems from './ConversationItems';
import ChatArea from './ChatArea';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function SideBar() {
  const navigate = useNavigate();
    const [conversations,setconversations] = useState([
        {
            name:"Test1",
            lastMessage:"last 1",
            timeStamp:"today",
        },
        {
            name:"Test1",
            lastMessage:"last 1",
            timeStamp:"today",
        },
        {
            name:"Test1",
            lastMessage:"last 1",
            timeStamp:"today",
        },
    ]);
    
  return (
    <div className='sidebar-container'>
      <div className='sidebar-header'>
        <div><IconButton><PersonOutlineIcon /></IconButton></div>
        <div>
        <IconButton onClick={()=>{navigate('/app/users')}}><PersonAddAltIcon /></IconButton>       
        <IconButton onClick={()=>{navigate('/app/groups')}}><GroupAddIcon /></IconButton>  
        <IconButton onClick={()=>{navigate('/app/creategroup')}}><AddIcon /></IconButton>  
        <IconButton><NightlightRoundIcon /></IconButton> 
        </div>
         
        
      </div>
      <div className='sidebar-search'>
        <IconButton><SearchIcon /></IconButton>
        <input placeholder='Search..' className='search-box'/>
      </div>
      
      <div className='sidebar-content'>
    {conversations.map((conversation) => (
        <ConversationItems props={conversation} key={conversation.name}  />
        
    ))}
    

</div>
{/* {conversations.map((conversation) => (
        <ChatArea 
            key={conversation.name} 
            name={conversation.name} 
            timeStamp={conversation.timeStamp} 
        />
    ))} */}

      
    </div>
  )
}

export default SideBar
