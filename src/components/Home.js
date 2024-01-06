import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import "./style.css"
export const Home = () => {

    const slides = [
        { id: 1, image: './Ad1.png', alt: 'Advertisement 1', width: '100%', height: 'auto' },
        { id: 2, image: './Ad2.png', alt: 'Advertisement 2', width: '100%', height: 'auto' },
        { id: 2, image: './Ad3.png', alt: 'Advertisement 2', width: '100%', height: 'auto' },
        // Add more slides as needed
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
                <Link className='icons' to='/'>
                    <img src='./logo1.svg'
                        style={{
                            marginBottom: '.25vmax',
                            width: '4vmax',
                            height: '4vmax',
                            border: '.12vmax  solid #59C65B',
                            borderRadius: '2vmax'
                        }} />
                    <span>BeFitSocial</span></Link>
                <ol>
                    <Link className='icons' id='A' to='/'><FaHome /></Link>
                    <Link className='icons' id='A' to='/login'>LogIn </Link>
                    <Link className='icons' id='A' to='/Register'>Register </Link>
                </ol>
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
        </div>
    )
}
export default Home