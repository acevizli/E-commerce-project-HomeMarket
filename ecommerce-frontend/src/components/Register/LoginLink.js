import React from 'react'
import { Link } from 'react-router-dom'

function LoginLink(props){
    return <Link className="register-link" to="/login"> Already have an Account? </Link>

}

export default LoginLink