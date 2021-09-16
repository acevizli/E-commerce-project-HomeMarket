import React, {Component} from 'react';
import LoginForm from './LoginForm'
import LoginLogo from  './LoginLogo'
import RegisterLink from './RegisterLink'
import HomePageLink from './HomePageLink'


class Login extends Component{

    render(){
        return  <div>
                    <LoginLogo/>
                    <LoginForm/>
                    <div className="register-link-container">
                        <RegisterLink/>
                        <HomePageLink/>
                    </div>
                </div>
    }
}

export default Login