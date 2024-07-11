import React, { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { RedirectToSignIn } from '@clerk/clerk-react';
import axios from 'axios';
import { useUserData } from '../../Context/UserDataContext';

function PrivateRoute({ children }) {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const {userData, setUserData, makeAPICall} = useUserData();

    useEffect(() => {
        
        makeAPICall()
        
        //console.log(isSignedIn)
    }, [isSignedIn, user]);

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    return children;
}

export default PrivateRoute;
