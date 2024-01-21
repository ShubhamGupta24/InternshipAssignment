import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { HiPencilSquare } from "react-icons/hi2";
import { MdAddAPhoto, } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, database, upload } from "../firebase";
import { TasksShow } from './TasksShow';
import { ref } from 'firebase/database';
import { useAuth } from '../Context/Context';
import "./style.css";


export const Profile = () => {
    // For Current Location of User
    const { address, location } = useAuth();
    const [localAddress, setLocalAddress] = useState(false)
    const [coordinates, setCoordinates] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // For task management
    const [newDescription, setNewDescription] = useState('"eg : I am cool"');
    const [loadDescription, setLoadDescription] = useState(false);
    const [loadTask, setLoadTask] = useState(false);
    const [newTask, setNewTask] = useState('"eg : task 1"');
    const [newPost, setNewPost] = useState(false);
    // for User Details
    const [uid, setUid] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);



    useEffect(() => {
        try {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    // User is signed in
                    setUid(user.uid);
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
                    console.log('User Signed Out');
                }

            })
            if ('geolocation' in navigator) {
                // navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
                // Shubham Always Remember thatdo not make mistake in the above convention of navigator
                navigator.geolocation.getCurrentPosition(
                    // Success callback
                    function (position) {
                        const { latitude, longitude } = position.coords;

                        console.log(position);
                        setCoordinates({ latitude, longitude });
                        console.log({ latitude, longitude });
                    },
                    // Error callback
                    function (error) {
                        console.error('Error getting location:', error.message);
                        setError('Unable to retrieve location.');
                    },
                    { enableHighAccuracy: true }
                );
                console.log("lat:", coordinates.latitude)
                console.log("lng:", coordinates.longitude)
            } else {
                setError('Geolocation is not supported by your browser.');
            }
        } catch (error) {
            console.log(error);
        }
    }, [uid, photo])


    const PostTask = () => {

        if (uid) {
            if (addTask() && addDescription() && newTask !== '"eg : task 1"' && newDescription !== '"eg : task 1"') {
                try {
                    console.log(uid);

                    const res = fetch(ref(database) + "/UserRecords/" + uid + "/Tasks.json", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        }, body: JSON.stringify({
                            taskdescription: newDescription,
                            taskName: newTask
                        }),
                    });
                    if (res) {
                        toast.success("Tasks Added");
                        setLoadDescription(false);
                        setLoadTask(false);
                        setNewPost(false);
                    } else {
                        toast.warning("plz fill the data");
                    }
                } catch (error) {
                    // if (error.code === 'auth/email-alread-in-use')
                    console.log(error);

                }
            }
            else {
                toast.warning("Update Task Info");

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
                navigate('/login');
            }).catch((error) => {
                // An error happened.
                console.log(error);
            });
        }
    }


    const task = () => {
        setLoadTask(true);
        setNewTask("");
    }
    const addTask = () => {
        if (!newTask) {
            toast.warning('Task Cannot be empty')
        }
        else {
            return true;
        }
    }


    const done = () => {
        addDescription();
        addTask();
        setLoadDescription(false);
        setLoadTask(false);
        setNewPost(true);
    }

    const describe = () => {
        setLoadDescription(true);
        setNewDescription("");
    }

    const addDescription = () => {
        if (!newDescription) {
            toast.warning('Description Cannot be empty')
        }
        else {
            return true;
        }
    }

    const myLocation = async () => {
        if (coordinates) {
            console.log("I am from", location(coordinates));
            location(coordinates);
            setLocalAddress(true);
        }
        else
            alert("Coordinates Not Found");
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
                    <Row
                        style={{
                            padding: '15px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: "10px",
                            border: '2px solid white',
                            margin: '1%'
                        }}>
                        <div>
                            <h2 style={{ display: 'flex', color: 'white', justifyContent: 'center' }}>Your Profile </h2>
                        </div>
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

                            <div><label className='input'>UserName : {username} </label></div>

                            <div><label className='input'>Email : {email}</label></div>

                            <div>
                                {
                                    !localAddress ?
                                        (<button className='bttn' onClick={myLocation}>GetMyLocation</button>)
                                        : (<><label className='input'>Address : {address}</label></>)}
                            </div>

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

                        <div style={{
                            border: '2px solid white',
                            padding: '2%',
                            margin: '1%',
                            borderRadius: '10px'
                        }}>
                            <h1 style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>Add Task</h1>
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
                                            onChange={(e) => { setNewTask(e.target.value) }} />
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
                                        }}>{newTask}</div>

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
                                        }}>{newDescription}</div>

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
                                            onChange={(e) => { setNewDescription(e.target.value) }} />

                                    </>
                                )
                            }
                            {
                                loadDescription || loadTask ? (
                                    <>
                                        <div>
                                            <button
                                                onClick={done}
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
                                        </div>

                                    </>
                                ) : (
                                    newPost ? (
                                        <>
                                            <div>
                                                <button
                                                    onClick={PostTask}
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
                                                    <span>Post Task</span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div />
                                    )
                                )

                            }
                        </div>

                    </div>
                    <Row className="justify-content-center">

                        <TasksShow uid={uid} />

                    </Row>
                    <ToastContainer />
                </Container>

            </div >
        </>
    )
}

export default Profile;
