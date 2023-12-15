import { onValue, ref, remove } from 'firebase/database'
import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { auth, database } from '../firebase'
import "./style.css"
export const TasksShow = (props) => {
    // let response;
    const [info, setInfo] = useState([]);
    useEffect(() => {
        const reference = ref(database, "UserRecords/" + props.uid + "/Tasks/")

        onValue(reference, (snapshot) => {
            try {
                const data = snapshot.val();
                if (!data) setInfo([]);
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


    const DeleteTask = (id) => {
        const reference = ref(database, "UserRecords/" + props.uid + "/Tasks/" + id + "/")
        remove(reference, id + '/').then(() => {
            console.log('Removed Successfully');
        }).catch((error) => console.log(error))
    }
    return (
        <>
            <div>
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
                                                    padding: '20px',
                                                    margin: '20px',
                                                    background: 'transparent',
                                                    color: 'white',
                                                    border: 'white 2px solid ',
                                                    borderRadius: '10px'
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
        </>
    )
}
