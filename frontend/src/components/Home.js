import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaInstagram, FaLinkedinIn, FaGithubSquare } from "react-icons/fa";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./style.css"


export const Home = () => {

    const slides = [
        { id: 1, image: './Ad1.png', alt: 'Advertisement 1', width: '100%', height: 'auto' },
        { id: 2, image: './Ad2.png', alt: 'Advertisement 2', width: '100%', height: 'auto' },
        { id: 3, image: './Ad3.png', alt: 'Advertisement 2', width: '100%', height: 'auto' },
    ];


    const settings = {
        dots: true,
        infinite: true,
        adaptiveHeight: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className='home'>

            <div className='nav'>
                <ul>
                    <Link className='icons' to='/'>
                        <img src='./logo1.svg' alt='Logo'
                            style={{
                                marginBottom: '.25vmax',
                                width: '4vmax',
                                height: '4vmax',
                                border: '.12vmax  solid #59C65B',
                                borderRadius: '2vmax'
                            }} />
                        <span>BeFitSocial</span></Link>

                    <Link className='icons' to='/'><FaHome /></Link>
                    <Link className='icons' to='/login'>LogIn </Link>
                    <Link className='icons' to='/Register'>Register </Link>
                </ul>
            </div>

            <div style={{
                marginTop: '1.5em',
                justifyContent: 'center',
                justifyItems: 'center',
                alignItems: 'center',
                width: '100vw',
                height: '100vh',
            }} >
                <br />
                <div className='carousel' >
                    <Slider {...settings} >
                        {slides.map((slide) => (
                            <div key={slide.id} >
                                <img src={slide.image} alt={slide.alt} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
            <div className="footer">
                <ul>
                    <span style={{ fontSize: '1.8vmax' }}>Connect with developer:</span>
                    <Link to='https://github.com/ShubhamGupta24'
                        style={{
                            textDecoration: 'none',
                            padding: '0', margin: '1vw',
                            color: '#59C65B'
                        }}><FaGithubSquare size={40} /></Link>
                    <Link to="https://www.instagram.com/its_shubham_guys?igsh=MWJhZ3UzY3FnbnBtdA"
                        style={{
                            textDecoration: 'none',
                            padding: '1vw',
                            margin: '1vw',
                            color: '#59C65B'
                        }}><FaInstagram size={40} /></Link>
                    <Link to="https://www.linkedin.com/in/shubham-gupta-4930b522a"
                        style={{
                            textDecoration: 'none',
                            padding: '1vw',
                            margin: '1vw',
                            color: '#59C65B'
                        }}><FaLinkedinIn size={40} /></Link>
                </ul>
            </div>
        </div>
    )
}
export default Home