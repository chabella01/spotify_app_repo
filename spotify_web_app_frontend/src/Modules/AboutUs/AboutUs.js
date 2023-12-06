import {React, useState} from 'react'
import './AboutUs.css'
import {useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import pfp from "../../Assets/Images/pfp_demo.png"
import taing from "../../Assets/Images/taing.png"
import steven from "../../Assets/Images/steven.png"
import christian from "../../Assets/Images/christian.png"
import david from "../../Assets/Images/david.png"


function AboutUs() {
    return (

        <div class="card-group">
            <div class="card">
                <img class="card-img-top" src={pfp} alt="Card image cap"/>
                <div class="card-body">
                <h5 class="card-title">Jacob</h5>
                <p class="card-text">Computer Engineer and Musician Hobbyist.</p>
                </div>
                <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
                </div>
            </div>
            <div class="card">
                <img class="card-img-top" src={christian} alt="Card image cap"/>
                <div class="card-body">
                <h5 class="card-title">Christian</h5>
                <p class="card-text">Computer Engineer.</p>
                </div>
                <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
                </div>
            </div>
            <div class="card">
                <img class="card-img-top" src={taing} alt="Card image cap"/>
                <div class="card-body">
                <h5 class="card-title">Justin</h5>
                <p class="card-text">Computer Engineer.</p>
                </div>
                <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
                </div>
            </div>
            <div class="card">
                <img class="card-img-top" src={david} alt="Card image cap"/>
                <div class="card-body">
                <h5 class="card-title">David</h5>
                <p class="card-text">Computer Engineer.</p>
                </div>
                <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
                </div>
            </div>
            <div class="card">
                <img class="card-img-top" src={steven} alt="Card image cap"/>
                <div class="card-body">
                <h5 class="card-title">Steven</h5>
                <p class="card-text">Computer Engineer and Car Enthusiast.</p>
                </div>
                <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
                </div>
            </div>
            </div>

        );
    }

export default AboutUs