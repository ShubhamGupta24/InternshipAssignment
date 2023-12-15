import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { HiPencilSquare } from "react-icons/hi2";
import { MdAddAPhoto } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, database, upload } from "../firebase";
import { TasksShow } from './TasksShow';
import { ref } from 'firebase/database';
import "./style.css";

// import logo
export const Profile = () => {
    const history = useNavigate();
    const [description, setDescription] = useState('I am cool');
    const [newDescription, setNewDescription] = useState('');
    const [loadDescription, setLoadDescription] = useState(false);
    const [loadTask, setLoadTask] = useState(false);
    const [alltask, setAllTask] = useState('task 1');
    const [newTask, setNewTask] = useState('');
    const [uid, setUid] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);



    useEffect(() => {
        console.log('root');
        try {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/auth.user
                    // uid = user.uid;
                    setUid(user.uid);
                    console.log(user);
                    setUsername(user.displayName);
                    setEmail(user.email);
                    setPhoto(user.photoURL);
                    if (!photo) {
                        setPhoto("../defaultProfilePhoto.webp")
                    }
                    console.log('uid:' + uid);
                    const res = await fetch(ref(database) + "/UserRecords/" + uid + "/Tasks.json");
                    console.log(res.text());
                }
                else {
                    // User is signed out
                    console.log('none');
                }

            })
        } catch (error) {
            console.log(error);
        }
    }, [auth.currentUser])



    const PostTask = () => {

        if (uid && addTask) {
            try {
                console.log(uid);

                const res = fetch(ref(database) + "/UserRecords/" + uid + "/Tasks.json", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }, body: JSON.stringify({
                        taskdescription: description,
                        taskName: alltask
                    }),
                });
                if (res) {
                    toast.success("Tasks Added");
                } else {
                    toast.warning("plz fill the data");
                }
            } catch (error) {
                // if (error.code === 'auth/email-alread-in-use')
                console.log(error);

            }
        }
        else {
            toast.warning('First Login / Register')
        }
    }

    const profilePhoto = () => {
        setLoading(true)

    }

    const handlePhoto = (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }

    }

    const photoUpload = () => {
        const user = auth.currentUser;
        if (photo !== user.photoURL) {
            upload(photo, user, setLoading, setPhoto);
        }

    }

    const signOutUser = async () => {
        if (uid) {
            await signOut(auth).then((userCredential) => {
                console.log('successfully signout');
                history('/login');
            }).catch((error) => {
                // An error happened.
                console.log(error);
            });
        }
    }


    const task = () => {
        setLoadTask(true);
    }
    const addTask = () => {
        if (!newTask) {
            toast.warning('Task Cannot be empty')
        }
        else {
            setAllTask(newTask);
            setLoadTask(false);
            PostTask();
            return true;
        }
    }

    const describe = () => {
        setLoadDescription(true);
    }
    const addDescription = () => {
        if (!newDescription) {
            toast.warning('Description Cannot be empty')
        }
        else {
            setDescription(newDescription);
            setLoadDescription(false)
        }
    }
    const HandleDescription = (e) => {
        e.preventDefault();
        const value = e.target.value;
        console.log(value);
        setNewDescription(value);
        console.log((value));
    }
    return (
        <>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                boxSizing: 'content-box',
                backgroundImage: `url('./milky-way-2695569_1280.jpg')`,
                backgroundSize: 'cover',
                padding: '15px'
            }}>

                <Container
                    className='contain'>
                    <h2 style={{ color: 'white', textAlign: 'center !important' }}>Profile Page</h2>
                    <Row
                        style={{
                            padding: '15px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: "10px",
                            border: '2px solid white',
                            margin: '1%'
                        }}>
                        <Col
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '2%',
                                marginRight: '2%'
                            }}>
                            <img src={photo}
                                width="200rem"
                                height='200rem'
                                style={{
                                    border: '5px solid grey',
                                    backgroundColor: 'white',
                                    borderRadius: '550px',
                                    padding: '3%',
                                    margin: '5px',
                                    color: 'black'
                                }}
                                alt='Profile' />
                        </Col>
                        <Col style={{
                            fontFamily: "sans-serif",
                            fontSize: "20px",
                            width: '100rem',
                            backdropFilter: 'blur(100px)',
                            borderRadius: "10px",
                            padding: '2%'
                        }}>

                            <div><span className='input'>UserName : {username} </span></div>

                            <div><label className='input'>Email : {email}</label></div>

                        </Col>

                        <Row>
                            <button onClick={profilePhoto}
                                style={{
                                    position: 'relative',
                                    padding: '10px',
                                    border: '2px solid white',
                                    borderRadius: '20px',
                                    background: 'transparent',
                                    color: 'white',
                                    justifyContent: 'center',
                                }} >Reset Profile Photo <MdAddAPhoto size={'1.5rem'} /></button>
                            <div>
                                {
                                    loading &&
                                    <>
                                        <input type="file" id="uploadImage" accept="image/*" onChange={handlePhoto} />
                                        <button className='bttn' onClick={photoUpload}>Upload</button>
                                    </>

                                }
                            </div>
                            <Link to='/PasswordReset' style={{
                                textDecoration: 'none',
                                marginTop: "1rem",
                                marginBottom: "1rem",
                                textAlign: "center",
                                color: "white",
                                background: "transparent",
                                border: '2px solid white',
                                borderRadius: "20px",
                                width: '100%',
                                padding: '10px'
                            }}>Reset Password <HiPencilSquare size={'1.5rem'} /></Link>
                            <button
                                style={{
                                    marginBottom: "1rem",
                                    textAlign: "center",
                                    color: "white",
                                    background: "transparent",
                                    borderColor: "white",
                                    borderRadius: "20px",
                                    justifyContent: "center",
                                    padding: '10px'
                                }}
                                onClick={signOutUser}>SignOut <FaSignOutAlt size={'1.5rem'} /></button>
                        </Row>

                    </Row>
                    <div>
                        <h1 style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>Add Task</h1>
                        <div style={{
                            border: '2px solid white',
                            padding: '2%',
                            margin: '1%',
                            borderRadius: '10px'
                        }}>
                            {
                                loadTask ? (
                                    <>

                                        <label
                                            style={{
                                                background: 'transparent',
                                                margin: "5px",
                                                padding: "5px",
                                                border: '2px solid white',
                                                color: 'white',
                                                width: '100%',
                                                borderRadius: '5px',
                                                justifyContent: 'center',
                                                fontSize: '20px'
                                            }}>Task :

                                        </label>
                                        <input
                                            style={{
                                                background: 'transparent',
                                                margin: "5px",
                                                padding: "5px",
                                                border: '2px solid white',
                                                color: 'white',
                                                width: '100%',
                                                borderRadius: '5px',
                                                justifyContent: 'center',
                                                fontSize: '20px',
                                                outline: 'none'
                                            }}
                                            type="text"
                                            placeholder={"Add Task"}
                                            value={newTask}
                                            onChange={(e) => { setNewTask(e.target.value) }} />
                                        <button
                                            onClick={addTask}
                                            style={{
                                                background: 'transparent',
                                                margin: '5px',
                                                border: '2px solid white',
                                                borderRadius: '10px',
                                                color: 'white',
                                                width: '6rem',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <span>Done</span>
                                        </button>
                                    </>


                                ) : (
                                    <>
                                        <div
                                            style={{
                                                background: 'transparent',
                                                margin: "5px",
                                                padding: "5px",
                                                border: '2px solid white',
                                                color: 'white',
                                                width: 'auto',
                                                borderRadius: '5px',
                                                justifyContent: 'center',
                                                fontSize: '20px'
                                            }}>Task :{loadDescription}
                                            <button style={{
                                                border: 'none',
                                                background: 'transparent',
                                                color: 'white',
                                            }}
                                                onClick={task}><HiPencilSquare /></button>
                                        </div>
                                        <div style={{
                                            background: 'transparent',
                                            border: '2px solid white',
                                            borderRadius: '5px',
                                            margin: "5px",
                                            padding: "5px",
                                            width: 'auto',
                                            fontSize: '20px'
                                        }}>{alltask}</div>

                                    </>
                                )
                            }

                            {
                                !loadDescription ? (
                                    <>

                                        <div
                                            style={{
                                                background: 'transparent',
                                                margin: "5px",
                                                padding: "5px",
                                                border: '2px solid white',
                                                color: 'white',
                                                width: 'auto',
                                                borderRadius: '5px',
                                                justifyContent: 'center',
                                                fontSize: '20px'
                                            }}>Task Description :{loadDescription}
                                            <button style={{
                                                border: 'none',
                                                background: 'transparent',
                                                color: 'white'
                                            }}
                                                onClick={describe}><HiPencilSquare /></button>
                                        </div>
                                        <div style={{
                                            background: 'transparent',
                                            border: '1px solid white',
                                            borderRadius: '5px',
                                            margin: "5px",
                                            padding: "5px",
                                            width: 'auto',
                                            fontSize: '20px'
                                        }}>{description}</div>

                                    </>) : (
                                    <>
                                        <label
                                            style={{
                                                background: 'transparent',
                                                margin: "5px",
                                                padding: "5px",
                                                border: '2px solid white',
                                                color: 'white',
                                                width: '100%',
                                                borderRadius: '5px',
                                                justifyContent: 'center',
                                                fontSize: '20px'
                                            }}>Task Description :

                                        </label>
                                        <input
                                            style={{
                                                background: 'transparent',
                                                margin: "5px",
                                                padding: "5px",
                                                border: '2px solid white',
                                                color: 'white',
                                                width: '100%',
                                                borderRadius: '5px',
                                                justifyContent: 'center',
                                                outline: 'none',
                                                fontSize: '20px'
                                            }}
                                            type="text"
                                            placeholder={"Add Description"}
                                            value={newDescription}
                                            onChange={HandleDescription} />
                                        <button
                                            onClick={addDescription}
                                            style={{
                                                background: 'transparent',
                                                margin: '5px',
                                                border: '2px solid white',
                                                borderRadius: '10px',
                                                color: 'white',
                                                width: '6rem',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <span>Done</span>
                                        </button>
                                    </>
                                )
                            }

                        </div>

                    </div>
                    <Row>
                        <TasksShow uid={uid} />

                    </Row>
                    <ToastContainer />
                </Container>

            </div >
        </>
    )
}

export default Profile;
