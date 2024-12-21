import { Card } from "@mui/material";
import { useState, useEffect } from "react";
import NavBar from "./Navbar";
import { auth, db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import "./classList.css";
import { DataGrid } from '@mui/x-data-grid';


const ClassList = () => {
    const [ClassName, setClassName] = useState();
    const [user, setUid] = useState(null); // Track user state
    const [classes, setClasses] = useState([]); // State to store documents
    const [loading, setLoading] = useState(true); // State to manage loading state
    const navigate = useNavigate(); // Initialize navigate hook
    const [columns, setColumns] = useState([
        { field: "Name", headerName: "Name", width: 200 },
        { field: "number_of_students", headerName: "Student Count", width: 300 },
      ]);

    useEffect(() => {
        const auth = getAuth(); // Get the authentication instance
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, get the UID
                setUid(user.uid);
                console.log("User UID:", user.uid);
            } else {
                // User is signed out
                setUid(null);
                console.log("No user is signed in.");
            }
        });

        // Clean up the observer when the component is unmounted
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchDocuments = async () => {
            if (!user) return;  // Ensure user is defined before fetching data
            try {
                // Reference to the Firestore collection
                console.log("debug: " + user);
                const snapshot = await getDocs(collection(db, "Users", user, "Classes"));
        
                const filteredRows = snapshot.docs.map(doc => ({
                    id: doc.id, // Maintain unique id for DataGrid
                    Name: doc.data().Name || 'N/A', // Default to 'N/A' if Name is missing
                    number_of_students: doc.data().number_of_students || 0, // Default to 0 if number_of_students is missing
                }));

                setClasses(filteredRows);
                console.log(filteredRows);  // Log filtered data
            } catch (error) {
                console.error("Error fetching documents: ", error);
            } finally {
                // Set loading to false once fetching is complete
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [user]); // Run this effect only when the user is updated

    const addClasses = async (e, action) => {
        if(action === "close"){
            let addClassCard = document.getElementById("addClassCardID");
            addClassCard.style.display = "none";
        }
        else if(action === "add"){
            let addClassCard = document.getElementById("addClassCardID");
            addClassCard.style.display = "flex";
        }
        else if(action === "submit"){
            //create a new class in classes container
            try {
                // Add a new class document to the "Classes" collection
                console.log(user.uid + "THIS IS THE ONE");
                const newClass = {
                    Name: ClassName,
                    number_of_students: 0,
                    createdAt: new Date(),
                    Status: true
                };
                const classDocRef = collection(db, "Users", user, "Classes");
                const docRef = await addDoc(classDocRef, newClass);
                navigate(`/class/${docRef.id}`); // docRef.id is the UID of the newly created class
            } catch (err) {
                console.error("Error fetching class data:", err);
                alert("Failure to create new class");
            }
        }
    };

    const handleRowClick = (params) => {
        // Navigate to the class page with the class ID
        navigate(`/class/${params.id}`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <img
                    src="./loading.gif"
                    alt="Loading..."
                    className="loading-gif"
                />
            </div>
        ); // Show loading state until all data is collected
    }

    return (
        <div className="student_list_card">
            <NavBar />
            <div className="DB_Under_Bar">
                <h1>Class List</h1>
            </div>
            <div className="DB_Graphs_Background" id="background">
                <div className="Students_List_Container">
                    <div className="card_top">CLASS LIST</div>
                    <div className="button_container">
                        <button onClick={(e) => addClasses(e, "add")} className="Add_Delete_Buttons">ADD</button>
                    </div>
                    <div className="Table_Container">
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={classes}
                            columns={columns}
                            pageSize={5} // Number of rows per page
                            rowsPerPageOptions={[5, 10, 25]} // Options for the user to change the page size
                            pagination // Ensures pagination is enabled
                            onRowClick={handleRowClick} // Attach the click handler
                            disableSelectionOnClick
                        />
                        </div>
                    </div>
                </div>
            </div>
            <div className="addClassCard" id="addClassCardID">
                <div className="card_top"><p>ADD A CLASS</p></div>
                <form id="classListForm">
                    <label className="Label_For_Login">Class Name</label>
                    <input type="text" onChange={e => setClassName(e.target.value)} className="Input_For_Login" />
                </form>
                <div id="classListBot">
                    <button onClick={(e) => addClasses(e, "close")} className="Add_Delete_Buttons">Close</button>
                    <button onClick={(e) => addClasses(e, "submit")} className="Add_Delete_Buttons">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ClassList;
