import { Card } from "@mui/material";
import { useState, useEffect } from "react";
import NavBar from "./Navbar";
import { auth, db, getCurrentUserUID } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { DataGrid } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import "./classList.css";
import InfoIcon from '@mui/icons-material/Info';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import GroupsIcon from '@mui/icons-material/Groups';
import GradeIcon from '@mui/icons-material/Grade';
import { Button, TextField } from "@mui/material";

const ClassPage = () => {
    const { uid } = useParams(); // Dynamic 'uid' parameter
    const [statusClass, setStatusClass] = useState("Inactive");
    const [classData, setClassData] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingLocal, setLoadingLocal] = useState(true);
    const [loadingGlobal, setLoadingGlobal] = useState(true);
    const [GlobalStudents, setGlobalStudents] = useState([]);
    const [LocalStudents, setLocalStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // Search query state
    const [filteredStudents, setFilteredStudents] = useState([]); // Filtered students

  
    // Fetch User UID
    useEffect(() => {
      const fetchUID = async () => {
        try {
          const uid = await getCurrentUserUID();
          setUser(uid); // Set the user UID
        } catch (error) {
          console.error("Error getting user UID:", error);
        }
      };
      fetchUID();
    }, []);
  
    // Fetch Class Data
    useEffect(() => {
      const fetchClassData = async () => {
        if (!user || !uid) return;
  
        try {
          const classDocRef = doc(db, "Users", user, "Classes", uid);
          const docSnap = await getDoc(classDocRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            setClassData(data);
            setStatusClass(data.Status ? "Active" : "Inactive");
          } else {
            console.error("No class found with the provided UID.");
          }
        } catch (error) {
          console.error("Error fetching class data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchClassData();
    }, [user, uid]);
  
    // Fetch Global Students
    useEffect(() => {
      const fetchStudentList = async () => {
        if (!user) return;
  
        try {
            console.log("user uid" + user + "\n" + "class uid: " + uid);
            const studentCollectionRef = collection(db, "Users", user, "Students");
            const data = await getDocs(studentCollectionRef);
            const studentData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setGlobalStudents(studentData);
            setFilteredStudents(studentData);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally{
            setLoadingGlobal(false);
          }
      };
  
      fetchStudentList();
    }, [user]);

    // Fetch Local Students
    useEffect(() => {
        const fetchStudentList = async () => {
          if (!user) return;
    
          try {
            const studentCollectionRef = collection(db, "Users", user, "Classes", uid, "Students");
            const data = await getDocs(studentCollectionRef);
            const studentDataLocal = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setLocalStudents(studentDataLocal);
          } catch (error) {
            console.error("Error fetching students:", error);
          } finally{
            setLoadingLocal(false);
          }
        };
    
        fetchStudentList();
      }, [user]);

      useEffect(() => {
        console.log("Global Students after update:", GlobalStudents);
      }, [GlobalStudents]);
      
      useEffect(() => {
        console.log("Local Students after update:", LocalStudents);
      }, [LocalStudents]);

    if (loading || loadingGlobal || loadingLocal) {
        return (<div className="loading-container">
        <img
            src="/loading.gif"
            alt="loading"
        />
    </div>
        )
    }

    const addStudents = () => {
        console.log("click");
    }

    // Ensure classData is not null before trying to access classData.Name
    if (!classData) {
        return (
            <div className="loading-container">
                <img
                    src="./loading.gif"
                    alt="Loading..."
                    className="loading-gif"
                />
            </div>
        );
    }

    // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter students based on the search query
    if (query === "") {
      setFilteredStudents(GlobalStudents); // Show all students if no query
    } else {
      const filtered = GlobalStudents.filter((student) =>
        student.Name.toLowerCase().includes(query.toLowerCase()) // Case-insensitive search
      );
      console.log(filtered);
      setFilteredStudents(filtered);
    }
  };

    // Define columns for the DataGrid
  const columns = [
    {
      field: "Name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          //onClick={() => handleDeleteStudent(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

    const renderCreatedAt = (timestamp) => {
        if (timestamp) {
            // Convert Firebase Timestamp to JavaScript Date object
            const date = timestamp.toDate();
            return date.toLocaleString(); // Convert to a human-readable string
        }
        return null;
    };

    return ( 
        <div className="student_list_card">
            <NavBar />
            <div className="DB_Under_Bar">
                <h1>{classData.Name}</h1>
            </div>
            <div className="DB_Graphs_Background" id = "background">
                <div className = "classPage_card_holder">
                    <div className="class_info">
                        <div className="classCardHeader" id="header_class_info"><h3>Class Info</h3></div>
                        <div className="classCardBody" id="body_class_info">
                            <p>Class created:   {renderCreatedAt(classData.createdAt)}</p>
                            <p>Number of Students:   {classData.number_of_students}</p>
                            <p>Status:   {statusClass}</p>
                        </div>
                    </div>
                    <div className="custom_fields">
                        <div className="classCardHeader" id="header_class_info"><h3>Custom Fields</h3></div>
                    </div>
                    <div className="students">
                        <div className="classCardHeader" id="students_class_info"><h3>Students</h3> <button id = "student_button" onCLick={addStudents()} className="Add_Delete_Buttons">ADD<div className="addStudentsContextMenu">
                        <TextField
                            label="Search Students"
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={{backgroundColor: "#7A9E7E"}}
                        />
                        <div style={{ height: 300, width: "100%", backgroundColor: "#7A9E7E"}}>
                        <DataGrid
                            rows={filteredStudents} // Display filtered students
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            disableSelectionOnClick
                        />
                        </div>
                        </div></button> </div>
                        <div className="classCardBody" id="body_students">
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={LocalStudents}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                disableSelectionOnClick
                            />
                            
                        </div>
                        </div>
                    </div>
                    <div className="assessments">
                        <div className="classCardHeader" id="header_class_info"><h3>Assessments</h3></div>
                    </div>
                    <div className="actions"></div>
                    <div className="users"></div>
                    <div className="line"></div>
                    <div className="ui_box" id = "info_ui_box"><InfoIcon className = "icon" /></div>
                    <div className="ui_box" id = "custom_fields_ui_box"><AutoAwesomeIcon className = "icon" /></div>
                    <div className="ui_box" id = "students_ui_box"><GroupsIcon className = "icon" /></div>
                    <div className="ui_box" id = "assessments_ui_box"><GradeIcon className = "icon" /></div>
                    
                </div>
            </div>
            
            </div>

     );
}
 
export default ClassPage;