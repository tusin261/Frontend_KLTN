import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import TopbarAdmin from '../components/TopbarAdmin';
import SidebarAdmin from '../components/SidebarAdmin';
import TableUser from '../components/TableUser';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const Admin = () => {
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-12 px-0'>
          <TopbarAdmin />
          <div className='row mx-0'>
            <div className='col-md-2 border-end' style={{ height: "90vh" }}>
              <SidebarAdmin />
            </div>
            <div className='col-md-10'>
              <TableUser />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Admin