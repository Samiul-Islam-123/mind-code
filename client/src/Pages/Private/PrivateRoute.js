import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { RedirectToSignIn } from '@clerk/clerk-react';

function PrivateRoute({children}) {
 
    const {isSignedIn} = useAuth();

    if(!isSignedIn){
        return (<>
            <RedirectToSignIn />
        </>)
    }
 
    return children;
}

export default PrivateRoute