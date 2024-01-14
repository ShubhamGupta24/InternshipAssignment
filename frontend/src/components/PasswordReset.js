import React from 'react'
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';
import './style.css'
import { useRef } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



export const PasswordReset = () => {
    const navigate = useNavigate();
    const emailRef = useRef();
    const ResetPassword = async (e) => {
        e.preventDefault();
        try {
            if (!emailRef.current.value) {
                toast.warning('Empty Credentials not allowed')
            }
            else {
                console.log(emailRef);
                sendPasswordResetEmail(auth, emailRef.current.value)
                    .then((data) => {
                        console.log(data);
                        alert("Check your gmail")
                        console.log(emailRef);
                        navigate("/Profile")
                    }).catch(err => {
                        alert(err.code)
                        console.log(err);
                    })
            }
        }
        catch (error) {
            console.log(error);
        }

    }

    return (
        <>
            <div className='main'>
                <div className='contain'>
                    <h3>Reset<br /> Your <br />Password</h3>
                    <form >
                        <label className='input'>
                            Email:
                        </label>
                        <input
                            className='accept'
                            placeholder='Enter email '
                            ref={emailRef}
                            onChange={(e) => e.preventDefault()}
                        />
                        <button
                            className='bttn'
                            onClick={ResetPassword}
                            type='Submit'>Reset</button>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </>
    )
};
export default PasswordReset;
