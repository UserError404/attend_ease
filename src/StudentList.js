import { useState, useEffect } from "react";
import NavBar from "./Navbar";
import { auth, db } from "./firebase";
import {
    collection,
    getDocs,
    addDoc,
    getCountFromServer,
    deleteDoc,
    query,
    where,
    doc,
    getDoc,
    updateDoc,
    increment
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'ID', headerName: 'ID', width: 200 },
    { field: 'Name', headerName: 'Name', width: 400 },
    { field: 'GPA', headerName: 'GPA', width: 400 }
];

let newID;

const StudentList = () => {
    const [students, setStudentList] = useState([]);
    const [fName, setfName] = useState();
    const [lName, setlName] = useState();
    const [email, setEmail] = useState();
    const [studentID, setStudentID] = useState();
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [user, setUser] = useState(null); // Track user state
    const counterRef = doc(db, "Counters", "studentIDCounter");

    const newStudent = {
        GPA: 0,
        ID: newID,
        Name: fName + " " + lName,
    };

    const fetchStudentList = async () => {
        const studentCollectionRef = collection(db, "Users", user.uid, "Students");
        try {
            const data = await getDocs(studentCollectionRef);
            const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setStudentList(filteredData);  // Update the state with the new list
        } catch (err) {
            alert("Error fetching students");
            console.log(err);
        }
    };

    // Wait for user to be authenticated
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Update user state
        });

        // Cleanup the subscription when the component is unmounted
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const studentCollectionRef = collection(db, "Users", user.uid, "Students");
            const getStudentList = async () => {
                try {
                    const data = await getDocs(studentCollectionRef);
                    if (data.empty) {
                        alert("Students collection uninitialized. Try adding a new student to initalize Students Collection");
                    }
                    else{
                    const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    setStudentList(filteredData);
                    setLoading(false); // Set loading to false once data is fetched // Hide "No class data found" after 1 second
                    console.log(filteredData);
                    }
                } catch (err) {
                    alert("No students Collection");
                }
            };
            getStudentList();
        }
    }, [user]); // Dependency on `user` to ensure it is defined before fetching students

    const addStudents = async (e, action) => {
        console.log("INNIT MATEW");
        const studentsDocRef = collection(db, "Users", user.uid, "Students");
        if(action === "add"){
            const AddMenu = document.getElementById("menu");
            AddMenu.style.display = "flex";
        }
        else if(action === "close"){
            const AddMenu = document.getElementById("menu");
            AddMenu.style.display = "none";
        }
        else if(action === "submit"){
            try {
                const counterDoc = await getDoc(counterRef);  // Get the current counter value
                if (counterDoc.exists()) {
                    // Fetch the current ID from the Counter collection
                    const currentID = counterDoc.data().currentID;
                    console.log("Current ID from Counter: ", currentID);
    
                    // Create a new student object
                    const newStudent = {
                        ID: currentID,
                        Name: fName + " " + lName,
                        GPA: 0,
                    };
    
                    // Add the new student to the collection
                    await addDoc(studentsDocRef, newStudent);
    
                    // Increment the ID counter for the next student
                    await updateDoc(counterRef, {
                        currentID: increment(1),  // Increment the counter by 1
                    });
    
                    alert(`Student added with ID: ${currentID}`);
                    fetchStudentList();
                } else {
                    console.log("Counter document does not exist.");
                }
            } catch (err) {
                console.log(err);
            }
            const AddMenu = document.getElementById("menu");
            AddMenu.style.display = "none";
    }
    };

    const deleteStudents = async (e, action) => {
        console.log("DELETE");
        const studentsDocRef = collection(db, "Users", user.uid, "Students");
        if(action === "delete"){
            const delMenu = document.getElementById("delMenu");
            delMenu.style.display = "block";
        }
        else if(action === "close"){
            const delMenu = document.getElementById("delMenu");
            delMenu.style.display = "none";
        }
        else if(action === "submit"){
            try {
                console.log(studentID);
                const q = query(studentsDocRef, where("ID", "==", Number(studentID))); // Query to find the student with the given ID
                const querySnapshot = await getDocs(q);
            
                if (!querySnapshot.empty) {
                    // Document found, proceed with deletion
                    const doc = querySnapshot.docs[0];  // Get the first (and only) matching document
                    await deleteDoc(doc.ref);  // Delete the document
                    alert(`Deleted student with ID: ${studentID}`);
                    fetchStudentList();
                } else {
                    // No document found with the given ID
                    alert("No student found with the given ID.");
                }
            } catch (err) {
                console.error("Error deleting student:", err);
            }
            const DelMenu = document.getElementById("delMenu");
            DelMenu.style.display = "none";
    }
    };

    if (loading) {
        return ( <div className="loading-container">
            <img
                src="./loading.gif"
                alt="Loading..."
                className="loading-gif"
            />
        </div>); // Show loading state until user is authenticated
    }

    return (
        <div className="student_list_card">
            <NavBar />
            <div className="DB_Under_Bar">
                <h1>Students</h1>
            </div>
            <div className="DB_Graphs_Background">
                <div className="Students_List_Container">
                    <div className="card_top">STUDENT LIST</div>
                    <div className="button_container">
                        <button onClick={(e) => addStudents(e, "add")} className="Add_Delete_Buttons">ADD</button>
                        <button onClick={(e) => deleteStudents(e, "delete")} className="Add_Delete_Buttons" id="delete_button">DELETE</button>
                    </div>
                    <div className="Table_Container">
                        <DataGrid
                            rows={students}
                            columns={columns}
                            checkboxSelection={false}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5,
                                    },
                                },
                            }}
                            pageSizeOptions={[5]}
                            disableRowSelectionOnClick
                        />
                    </div>
                </div>
            </div>
            <div className="Add_Student_Menu" id="menu">
                <div className="menu_top">ADD STUDENT</div>
                <form>
                    <label className="Label_For_Login">First Name</label>
                    <input onChange={e => setfName(e.target.value)} type="text" className="Input_For_Login" />
                    <label className="Label_For_Login">Last Name</label>
                    <input onChange={e => setlName(e.target.value)} type="text" className="Input_For_Login" />
                    <label className="Label_For_Login">Email</label>
                    <input onChange={e => setEmail(e.target.value)} type="text" className="Input_For_Login" />
                </form>
                <div className="Add_Student_Menu_Button_Container">
                    <button onClick={(e) => addStudents(e, "close")} className="Add_Delete_Buttons">Close</button>
                    <button onClick={(e) => addStudents(e, "submit")} className="Add_Delete_Buttons">Submit</button>
                </div>
            </div>
            <div className="Add_Student_Menu" id="delMenu">
                <div className="menu_top">DELETE STUDENT</div>
                <form>
                    <label className="Label_For_Login">Student ID</label>
                    <input onChange={e => setStudentID(e.target.value)} type="text" className="Input_For_Login" />
                </form>
                <div className="Add_Student_Menu_Button_Container">
                    <button onClick={(e) => deleteStudents(e, "close")} className="Add_Delete_Buttons">Close</button>
                    <button onClick={(e) => deleteStudents(e, "submit")} className="Add_Delete_Buttons">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default StudentList;
