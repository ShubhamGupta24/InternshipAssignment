import { onValue, ref, remove } from 'firebase/database'
import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.css';
import { auth, database } from '../firebase'
import "./style.css"
export const TasksShow = (props) => {
    // let response;
    const [info, setInfo] = useState([]);
    const [search, setSearch] = useState('');
    useEffect(() => {
        const reference = ref(database, "UserRecords/" + props.uid + "/Tasks/")

        onValue(reference, (snapshot) => {
            try {
                const data = snapshot.val();
                if (!data)
                    setInfo([]);
                const taskPost = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                console.log("fkdro :-", taskPost);
                setInfo(taskPost)
            }
            catch (error) {
                console.log(error);
            }
        })

        console.log("arr:", info);

    }, [auth.currentUser])

    function searchTask() {
        let counter = 0;
        var des = '';
        info.forEach((task) => {
            if (task.taskName === search) {
                des = task.taskdescription
            }
        });
        if (des !== '')
            alert(`Task Found and Task Description : ${des}`);

        else
            alert(`Task Not Found`);


    }

    const DeleteTask = (id) => {
        const reference = ref(database, "UserRecords/" + props.uid + "/Tasks/" + id + "/")
        remove(reference, id + '/').then(() => {
            console.log('Removed Successfully');
        }).catch((error) => console.log(error))
    }
    return (
        <>
            <div
                style={{
                    padding: '20px',
                    margin: '18px',
                    background: 'transparent',
                    color: 'white',
                    border: 'white 2px solid ',
                    borderRadius: '10px',
                    width: '95%'
                }} >
                <h1 style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>Search Your Task</h1>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
                >
                    <input
                        style={{
                            background: 'transparent',
                            border: '2px solid white',
                            color: 'white',
                            width: '40vmax',
                            borderRadius: '5px',
                            justifyContent: 'center',
                            outline: 'none',
                            fontSize: '20px'
                        }}
                        placeholder={"Enter TaskName"}
                        onChange={(e) => { setSearch(e.target.value) }} />
                    <button style={{
                        margin: "5px",
                        padding: "1.5px",
                        borderRadius: '5px',
                        border: '2px solid white',
                        background: 'transparent',
                        color: 'white',
                        fontSize: '2vh'
                    }}
                        onClick={searchTask}
                    ><FaSearch /></button>
                </div>

                <div style={{ marginTop: '10%' }}>
                    <h1 className="text-center">Tasks Assigned</h1><br />
                    {
                        info && info.length > 0 ?
                            (
                                info.map((task, id) => {
                                    return (
                                        <>
                                            <div key={id}>
                                                {
                                                    id < 0 ? (
                                                        <div >No task Assigned</div>

                                                    ) : (<div style={{
                                                        padding: '5px',
                                                        margin: '5px',
                                                        background: 'transparent',
                                                        color: 'white',
                                                        border: 'white 2px solid ',
                                                        borderRadius: '10px',
                                                        width: '100%'
                                                    }} >
                                                        <div >
                                                            <div style={{ marginTop: "20px", fontSize: '20px' }} >Task Name : {task.taskName} </div>
                                                            <div style={{ marginTop: "20px", marginBottom: "20px", fontSize: '20px' }} > Task Description : {task.taskdescription} </div>
                                                            <button className='bttn' onClick={() => DeleteTask(task.id)}>delete</button>
                                                        </div>
                                                    </div>
                                                    )
                                                }
                                            </div>
                                        </>
                                    )
                                })
                            ) : (
                                <div>No task Assigned</div>
                            )
                    }
                </div>
            </div>
        </>
    )
}
