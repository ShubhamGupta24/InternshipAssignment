import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "./style.css"


export const Register = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        username: ""
    })
    const passwordConfirmRef = useRef();
    const history = useNavigate();
    // const [loading, setLoading] = useState(false);
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,12}$/;
    const handleChange = (e) => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        console.log(name, value);

        setInput({ ...input, [name]: value });

    }
    const IsValidate = () => {
        let isproceed = true;
        if (!input.email || !input.password || !input.username || !passwordConfirmRef.current.value) {
            isproceed = false;
            toast.warning("empty credentials are not entertained");
        }
        if (!PWD_REGEX.test(input.password)) {
            isproceed = false;
            if (input.password < 8)
                toast.warning("Password must contain atleast 8 character")
            if (input.password > 12)
                toast.warning("Password must contain atmost 12 character")

            toast.warning("Password must have atleast 1 small letter ,1 capital letter,1 special character and 1 number")
        }
        if (input.password !== passwordConfirmRef.current.value) {
            isproceed = false;
            toast.warning("Passwords do not match");
        }
        return isproceed;
    };
    async function handleSubmit(e) {
        e.preventDefault();

        if (IsValidate()) {
            try {
                // setLoading(true)
                await createUserWithEmailAndPassword(auth, input.email, input.password).then(async (userCredential) => {
                    try {
                        await updateProfile(auth.currentUser, {
                            displayName: input.username,
                            photoURL: "../defaultProfilePhoto.webp",
                        });
                        if (userCredential) {
                            setInput({
                                username: "",
                                email: "",
                                password: ""
                            });
                            toast.success("Data Stored");
                        } else {
                            toast.warning("plz fill the data");
                        }
                    } catch (error) {
                        if (error.code === 'auth/email-already-in-use') {
                            toast.info('Email already in use');
                            console.log(error);
                        }
                    }

                    history("/Profile");
                }).catch((error) => {
                    if (error === '')
                        console.log(error);
                });

            } catch (err) {
                // setLoading(false);
                console.log(err);
                toast.warning("Failed to create an account");
            }



        }
    };
    return (
        <section className='main' >
            <div className='contain'>
                <h1>Register</h1>
                {/* <pre>{JSON.stringify(emailRef, undefined, 2)}</pre>
            <pre>{JSON.stringify(passwordRef, undefined, 2)}</pre> */}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label
                            className='input'
                            htmlFor="username">Username</label>
                        <input
                            className='accept'
                            type="text"
                            placeholder='Username'
                            id='username'
                            name='username'
                            autoComplete='off'
                            onChange={handleChange}
                            value={input.username} />
                    </div>
                    <div>
                        <label className='input'
                            htmlFor="email">Email</label>
                        <input
                            className='accept'
                            type="email"
                            placeholder='email'
                            id='email'
                            name='email'
                            autoComplete='off'
                            onChange={handleChange}
                            value={input.email} />
                    </div>
                    <div>
                        <label
                            className='input'
                            htmlFor="password">Password</label>
                        <input
                            className='accept'
                            type="password"
                            placeholder='password'
                            id='password'
                            name='password'
                            autoComplete='off'
                            onChange={handleChange}
                            value={input.password}
                        />
                    </div>
                    <div>
                        <label
                            className='input'
                            htmlFor='confPassword'> Confirm Password</label>
                        <input
                            className='accept'
                            type="password"
                            placeholder='confirm password'
                            autoComplete='off'
                            name='confPassword'
                            id='confPassword'
                            onChange={handleChange}
                            ref={passwordConfirmRef} />
                    </div>

                    <div>
                        <button
                            className='bttn'
                            type='Submit'>Submit</button>
                    </div>
                    <div>

                        <Link
                            className='link'
                            to='/OTP'> Or use Phone Number</Link>
                    </div>
                    <ToastContainer />
                </form>

            </div>
        </section>
    )
};
export default Register;