import React from 'react'
import logo from '../../assets/log.png'

function LoginLogo(){
    return  <div className="logo-contianer">
                <figure className="login-figure">
                    <img className="photo" src={logo} alt="firm logo"/>
                    
                </figure>
            </div>
}

export default LoginLogo