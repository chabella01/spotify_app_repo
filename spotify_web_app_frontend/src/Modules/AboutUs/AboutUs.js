import {React, useState} from 'react'
import './AboutUs.css'
import {useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function AboutUs() {
    return (
        // <h1>
        // About Us
        // </h1>

        <div className="about-us-card card">
            <img src="your_image_path.jpg" className="card-img-top" alt="About Us" />
            <div className="card-body">
                <h5 className="card-title">About Us</h5>
                <p className="card-text">Information about your site or service.</p>
                {/* Other content */}
            </div>
        </div>
        );
    }

export default AboutUs