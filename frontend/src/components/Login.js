import React, { useState } from 'react';
import "./style.css"

import { Link } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./style.css"
export const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,12}$/;

    const [loginInput, setLoginInput] = useState({
        email: "",
        password: "",
        confPassword: ""
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (IsValidate()) {
                await signInWithEmailAndPassword(auth, loginInput.email, loginInput.password).then((userCredential) => {
                    console.log(userCredential.user);
                    navigate('/Profile');
                }).catch((error) => {
                    console.log(error);
                })
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
            toast.warning("Login Failed");
        }
    };
    const IsValidate = () => {
        let isproceed = true;
        if (!loginInput.email || !loginInput.password) {
            isproceed = false;
            toast.warning("empty credentials are not entertained");
            return isproceed;
        }
        if (!PWD_REGEX.test(loginInput.password)) {
            isproceed = false;
            if (loginInput.password < 8)
                toast.warning("Password must contain atleast 8 character")
            if (loginInput.password > 12)
                toast.warning("Password must contain atmost 12 character")

            toast.warning("Password must have atleast 1 small letter ,1 capital letter,1 special character and 1 number")
        }
        return isproceed;
    };

    const handleInput = (e) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        console.log(name, value);

        setLoginInput({ ...loginInput, [name]: value });
    }
    return (
        <>
            <div className='main'>
                <div className="contain">
                    <h1>Login</h1>
                    <form className='form' disabled={loading} onSubmit={handleSubmit}>
                        <div className='inputfield'>
                            <label className='input' htmlFor='email'>Email</label>
                            <input className='accept'
                                type="email"
                                placeholder='email'
                                autoComplete='off'
                                name='email'
                                id='email'
                                onChange={handleInput}
                                value={loginInput.email} />
                        </div>
                        <div className='inputfield' >
                            <label className='input' htmlFor='password'>Password</label>
                            <input className='accept'
                                type="password"
                                placeholder='password'
                                autoComplete='off'
                                name='password'
                                id='password'
                                onChange={handleInput}
                                value={loginInput.password} />
                        </div>

                        <div>
                            <button className='bttn' type='Submit'>LOGIN</button>
                        </div>
                        <div >
                            <Link className='link' to='/Register'>New User?SignUp Here</Link>
                        </div>
                        <ToastContainer />
                    </form>
                </div>
            </div>
        </>
    )
};
export default Login;
