import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import LoginNavbar from "../LoginNavbar";
import "../css/login.css"


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await signInWithEmailAndPassword(auth, email, password);
            console.log("USER SIGNED IN SUCCESSFULLY");
            window.location.href="/Dashboard";
            toast("USER SIGNED IN SUCCESSFULLY");
        }catch(error){
            console.log(error);
            toast.error(error.message, {position: "bottom-center"});
        }
    };

    console.log(email);
    return ( 
        <div>
            <LoginNavbar />
        <div className="Login_Container">
            <div id="b1">
            </div>
            <div id="b2">
            </div>
            <div id="b3">
            </div>
            <div id="b4">
            </div>
            <div id="b5">
            </div>
        </div>
                <form onSubmit = {handleSubmit} className = "Login_Form_Body">
                <h1 id="Login_Title">USER LOGIN</h1>
                <label className="Label_For_Login">Email</label><br/>
                <input onChange={e => setEmail(e.target.value)} className="Input_For_Login" type="text"></input><br/>
                <label className="Label_For_Login">Password</label><br/>
                <input onChange={e => setPassword(e.target.value)} className="Input_For_Login" type="password"></input><br/>
                <input className="Login_Button" type="submit" value="Login"></input>
                </form>
        </div>
        
        
     );
}
 
export default Login;