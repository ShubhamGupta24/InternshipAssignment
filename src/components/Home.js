import React from 'react';
import { Link } from 'react-router-dom';
import "./style.css"
export const Home = () => {
    return (
        <header className='main'>

            <nav className='contain'>
                <Link className='icons' id='N' to='/'>Home</Link>
                <Link className='icons' id='L' to='/login'>Login/SignUp</Link>
            </nav>
        </header>
    )
}
