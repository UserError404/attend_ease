import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import LoginNavbar from "./LoginNavbar";
import { doc, setDoc } from "@firebase/firestore";
const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    

    const handleSignUp = async (e) => {
        e.preventDefault();
        try{
          await createUserWithEmailAndPassword(auth,email,password);
          const user = auth.currentUser;
          console.log(user);
          console.log("USER IS REGISTERED SUCCESSFULLY");
          if(user){
            await setDoc(doc(db, "Users", user.uid),{
                email:user.email,
                firstName:fname,
                lastName:lname,
            });
          }
          if(user){
            window.location.href="/";
          }
        }catch(error){
            console.log(error);
        }
    }

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
                <form onSubmit = {handleSignUp} id="pwreset"  className = "Login_Form_Body">
                <h1 id="Login_Title">USER SIGN UP</h1>

                <label className="Label_For_Login">First Name</label><br/>
                <input onChange={e => setFname(e.target.value)} className="Input_For_Login" type="text"></input><br/>

                <label className="Label_For_Login">Last Name</label><br/>
                <input onChange={e => setLname(e.target.value)} className="Input_For_Login" type="text"></input><br/>

                <label className="Label_For_Login">Email</label><br/>
                <input onChange={e => setEmail(e.target.value)} className="Input_For_Login" type="text"></input><br/>

                <label className="Label_For_Login">Password</label><br/>
                <input onChange={e => setPassword(e.target.value)} id="new_password" className="Input_For_Login" type="password"></input><br/>

                <input className="Login_Button" type="submit" value="Sign Up"></input>
                </form>
        </div>
        
        
     );
}
 
export default SignUp;