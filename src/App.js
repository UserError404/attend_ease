import './App.css';
import Login from './js/login';
import LoginNavbar from './LoginNavbar';
import SignUp from './signUp';
import SideNavBar from './Navbar';
import Dashboard from './Dashboard';
import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";
import StudentList from './StudentList';
import AddStudent from './AddStudent';
import ClassList from './classList';
import ClassPage from './classPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path= "/">
      <Route index element={<Login />} />
      <Route path='SignUp' element={<SignUp />} />
      <Route path='Dashboard' element={<Dashboard />} />
      <Route path='StudentList' element={<StudentList />} />
      <Route path='AddStudent' element={<AddStudent />} />
      <Route path='ClassList' element={<ClassList />} /> 
      <Route path="/class/:uid" element={<ClassPage />} />
    </Route>
  )
)
function App() {
  return (
      
      <RouterProvider router={router} />
        
    
  );
}

export default App;
