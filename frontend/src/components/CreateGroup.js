import React from 'react'
import DoneAllIcon from '@mui/icons-material/DoneAll';

import { IconButton } from '@mui/material';
const CreateGroup = () => {
  return (
    <div className='creategroup-container'>
      <input placeholder='Enter group name..' className='search-box'/>
      <IconButton><DoneAllIcon/></IconButton>
    </div>
  )
}

export default CreateGroup
