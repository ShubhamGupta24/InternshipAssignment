import React, { useState } from 'react'
import OtpInput from "otp-input-react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import "./style.css";

export const OTP = () => {
    const [otp, setOtp] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [user, setUser] = useState(null);

    const style = {
        color: "white"
    }
    // Sign-in using phone number
    function onSignIn() {
        setLoading(true);
        onCaptchaVerify();
        console.log("enter sign in process");
        const appVerifier = window.recaptchaVerifier;
        const phoneNumber = "+" + phone;
        console.log(phone);
        // console.log(appVerifier);
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                setLoading(false);
                setShowOTP(true);
                toast.success("OTP sent successfully!");

            }).catch((error) => {
                console.log(window.confirmationResult);
                console.log("error log");
                console.log(error);
                setLoading(false);
            });
    }
    // Invisible reCAPTCHA
    function onCaptchaVerify() {
        console.log(window.recaptchaVerifier);
        if (!window.recaptchaVerifier) {
            try {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                    'size': 'invisible',
                    'callback': (response) => {
                        // reCAPTCHA solved, allow signInWithPhoneNumber.
                        // console.log(response);
                        toast.update("Solve the reCAPTHCHA ")
                        onSignIn();

                    },
                    "expired-callback": () => { toast.update("Solve the reCAPTHCHA again") },
                });
            } catch (error) {
                console.log("error in captcha");
                console.log(error);
            }
        }


    }

    function onOTPVerify() {
        setLoading(true);
        window.confirmationResult
            .confirm(otp)
            .then((res) => {
                console.log(res);
                setUser(res.user);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }
    return (
        <div className='main'>
            <div id="recaptcha-container"></div>


            {user ? (
                <h2 style={style}>Login Success</h2>
            ) : (
                <div className='contain'>
                    {
                        showOTP ? (
                            <>
                                <label
                                    className='input'
                                    htmlFor='ph' >Enter your OTP</label>
                                <OtpInput
                                    OTPLength={6}
                                    value={otp}
                                    onChange={setOtp}
                                    otpType="number"
                                    disabled={false}
                                    autoFocus
                                />
                                <button
                                    className='bttn'
                                    onClick={onOTPVerify}>
                                    {loading}
                                    <span >Verify OTP</span>
                                </button>
                            </>
                        ) : (
                            <>

                                <label
                                    className='input'
                                    htmlFor='ph' >Enter Your Phone Number</label>
                                <PhoneInput
                                    country={'in'}
                                    value={phone}
                                    onChange={setPhone}
                                    otpType="number"
                                    disabled={false}
                                    autoFocus
                                />
                                <button className='bttn' onClick={onSignIn} >
                                    {loading}
                                    <span>Verify Your Phone Number</span>
                                </button>
                            </>
                        )}
                </div>
            )
            }



            <ToastContainer />


        </div >
    )
}
export default OTP;
