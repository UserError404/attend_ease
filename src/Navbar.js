import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import GradingIcon from '@mui/icons-material/Grading';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EmailIcon from '@mui/icons-material/Email';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import SettingsIcon from '@mui/icons-material/Settings';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Padding } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "@firebase/firestore";
import { createBrowserRouter, Routes, Route, Link, createRoutesFromElements, NavLink } from "react-router-dom";

const obj = {
    '1': ["StudentsDropdown", "Students"],
    '2': ["ClassesDropdown", "Classes"],
    '3': ["GradesDropdown", "Grades"],
    '4': ["ParentsDropdown", "Parents"],
    '5': ["UsersDropdown", "Users"],
    '6': ["InvoicesDropdown", "Invoices"],
    '7': ["ToolsDropdown", "Tools"]
}

function handleDropdown(passedVal){
    /*close all open dropdowns*/
    for(let i = 1; i<8; i++){
        let dropdown = document.getElementById(obj[i][0]);
        let top = document.getElementById(obj[i][1]);

        const currentDisplay = window.getComputedStyle(dropdown).getPropertyValue("display");
        if(currentDisplay != 'none' && i != passedVal){
            dropdown.style.display = 'none';
            top.style.backgroundColor = "#7A9E7E";
            top.style.color = "black";
        }
    }

    let item = obj[passedVal][0]
    const el2 = document.getElementById(obj[passedVal][1]);

    /*console.log(item)*/
    
    const element = document.getElementById(item);
    const currentDisplay = window.getComputedStyle(element).getPropertyValue("display");
    /*console.log("Current display type:", currentDisplay);*/

    if(currentDisplay == 'none'){
        element.style.display = 'block';
        el2.style.backgroundColor = "#001A23";
        el2.style.color = "white";
    }
    else{
        element.style.display = 'none';
        el2.style.backgroundColor = "#7A9E7E";
        el2.style.color = "black";
    }   
}

    const buttonStyle = {
        color: '#111611',
        borderColor: '#111611',
        ml: '25%',
        width: '75%',
        float: 'right',
        '&:hover': {
        borderColor: 'white',
      },
    };

    const pfpStyle = {
        mr: 1,
    };

    const downArrowStyle = {
        ml: 1,
    };

    let open = false;
    function handleButton(){
        /*console.log("CLICKED");*/
        let topButton = document.getElementById('myDropdown');
        if(open == false){
            topButton.style.display = 'flex';
            open = true;
        }else{
            topButton.style.display = 'none';
            open = false;
        }
    };

const NavBar = () => {
    const [userDetails, setUserDetails] = useState(null);
    const fetchUserData=async()=>{
        auth.onAuthStateChanged(async(user)=>{
            /*console.log(user);*/
            const docRef=doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setUserDetails(docSnap.data());
                /*console.log(docSnap.data());*/
            }else{
                /*console.log("User is not logged in");*/
            }
        });
    };
    
    useEffect(()=>{
        fetchUserData()
    },[]);

    async function handleLogout(){
        try{
            await auth.signOut();
            window.location.href = "/";
            console.log("User successfully logged out");
        }catch (error){
            console.error("ERROR LOGGING OUT: ", error.message);
        }
    }
    return ( 
        <nav class="DB_Navbar">
            <div className="Title_Box">
            <h1 className="Navbar_DB_Title">AttendEase</h1>
            </div>
            <a className="DB_Nav_Dashboard" href="/Dashboard">
            <DashboardIcon /> &nbsp; &nbsp; Dashboard
            </a>

            <div className="navBar_dropdown_items"> &nbsp; Attendance <br/>
                <button className="DB_Nav_Dashboard_Links" href="/Dashboard">
                <CheckBoxIcon /> &nbsp; &nbsp;Take Attendance
                </button>
            </div >

            <div className="navBar_dropdown_items"> &nbsp; Management <br/>
                <a className="DB_Nav_Dashboard_Links" id="Students" onClick={() => handleDropdown('1')}>
                <PeopleIcon /> &nbsp; &nbsp; Students <KeyboardArrowDownIcon />
                </a>
                <ul id="StudentsDropdown">
                    <li><NavLink to="../StudentList">Student List</NavLink></li>
                    <li><NavLink to="../AddStudent">Add Student</NavLink></li>
                </ul>

                <a className="DB_Nav_Dashboard_Links" id="Classes" onClick={() => handleDropdown('2')}>
                <ClassIcon /> &nbsp; &nbsp; Classes <KeyboardArrowDownIcon />
                </a>
                <ul id="ClassesDropdown">
                    <li><NavLink to="../classList">Class List</NavLink></li>
                    <li><NavLink to="../StudentList">Add Class</NavLink></li>
                </ul>

                <a className="DB_Nav_Dashboard_Links" id="Grades" onClick={() => handleDropdown('3')}>
                <GradingIcon /> &nbsp; &nbsp; Grades <KeyboardArrowDownIcon />
                </a>
                <ul id="GradesDropdown">
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                </ul>

                <a className="DB_Nav_Dashboard_Links" id="Parents" onClick={() => handleDropdown('4')}>
                <EscalatorWarningIcon /> &nbsp; &nbsp; Parents <KeyboardArrowDownIcon />
                </a>
                <ul id="ParentsDropdown">
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                </ul>

                <a className="DB_Nav_Dashboard_Links" id="Users" onClick={() => handleDropdown('5')}>
                <PeopleOutlineIcon /> &nbsp; &nbsp; Users <KeyboardArrowDownIcon />
                </a>
                <ul id="UsersDropdown">
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                </ul>

                <a className="DB_Nav_Dashboard_Links" id="Invoices" onClick={() => handleDropdown('6')}>
                <ReceiptIcon /> &nbsp; &nbsp; Invoices <KeyboardArrowDownIcon />
                </a>
                <ul id="InvoicesDropdown">
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                </ul>
            </div>

            <div className="navBar_dropdown_items"> &nbsp; Message Center <br/>
                <a className="DB_Nav_Dashboard_Links" href="/Dashboard">
                <EmailIcon /> &nbsp; &nbsp; Main
                </a>
            </div>

            <div className="navBar_dropdown_items">&nbsp; Reporting <br/>
                <a className="DB_Nav_Dashboard_Links" href="/Dashboard">
                <AssessmentIcon /> &nbsp; &nbsp; Main
                </a>
            </div>

            <div className="navBar_dropdown_items"> &nbsp; Tools and Settings <br/>
                <a className="DB_Nav_Dashboard_Links" id="Tools" onClick={() => handleDropdown('7')}>
                <PlumbingIcon /> &nbsp; &nbsp; Tools <KeyboardArrowDownIcon />
                </a>
                <ul id="ToolsDropdown">
                    <li>1</li>
                    <li>1</li>
                    <li>1</li>
                </ul>
                <a className="DB_Nav_Dashboard_Links" href="/Dashboard">
                <SettingsIcon /> &nbsp; &nbsp; AttendEase Settings
                </a>
            </div>

            <div className="navBar_dropdown_items"> &nbsp; Contact <br/>
                <a className="DB_Nav_Dashboard_Links" href="/Dashboard">
                <ConnectWithoutContactIcon />&nbsp; &nbsp; Contact Us
                </a>
            </div>

            
            <ul className="Navbar_DB_Links">
               
            </ul>

            <div className="Top_Bar"><div className='top_button'>
            <div className='dropdown_container' id = "buttonContainer">
                <Button sx={buttonStyle} variant="outlined" onClick={handleButton}>
                <AccountCircleIcon sx={pfpStyle} /> {userDetails ? userDetails.firstName : null} <KeyboardArrowDownIcon sx={downArrowStyle}/>
                </Button>
                <div id="myDropdown" className="dropdown-content">
                <a id="profile_card" href="#"><AccountCircleIcon sx={pfpStyle} />{ userDetails ? userDetails.firstName + " " + userDetails.lastName : null}</a>
                <a id="settings_card"href="#">Settings &nbsp; <SettingsIcon /></a>
                <a id="logout_card" onClick={handleLogout}>Log Out &nbsp; <LogoutIcon /></a>
                </div></div></div>
            
            </div>
            
        </nav>
        
     );
}
 
export default NavBar;