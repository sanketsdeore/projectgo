import { RedirectToSignIn, SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

const Login = () => {
    return (
        <>
            <SignedOut>
                <div className='flex justify-center mt-10'>
                <SignIn/>
                </div>
            </SignedOut>

            <SignedIn>
                <Navigate to='/dashboard'/>
            </SignedIn>
        </>
    )
}

export default Login
