import React, { useState, useEffect } from 'react'
import { useHistory,useLocation } from "react-router-dom"
import { login } from '../../context/user_context.js'
import Message from '../../components/message.js'
import Loading from '../../components/Loading'
import { useDispatch, useSelector } from 'react-redux'
import ErrorPage from '../../pages/ErrorPage.js'
function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin
    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {
        if (userInfo) {
            if(userInfo.isSalesManager)
            {
                history.push('/admin/users')
            }
            else if(userInfo.isAdmin)
            {
                console.log(redirect)
                history.push('/admin/products')
            }
            else
            {
                history.push(redirect)
            }
        }
    }, [history, userInfo, redirect])
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }
    
        return  <div className="login-container">
                    {loading?<Loading/>:
                    <form className="login-form" onSubmit={submitHandler}>
                    {error && <Message variant = 'danger'>{'Wrong Password or Username'}</Message>}
                        <div className="login-input-box">
                            <span className="register-details">Username or Email</span>
                            <input type="text" placeholder="Username" name="username" value={email} onChange = {(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="login-input-box">
                            <span className="register-details">Password</span>
                            <input type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <button> Login </button>
                    </form>
                    }
                </div>
                
    }

export default LoginForm