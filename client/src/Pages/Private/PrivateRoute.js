import React, { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { RedirectToSignIn } from '@clerk/clerk-react';
import axios from 'axios';
import { useUserData } from '../../Context/UserDataContext';

function PrivateRoute({ children }) {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const {userData, setUserData} = useUserData();

    useEffect(() => {
        async function handleSignupOrSignin() {
            try {
                if (isSignedIn) {
                    
                    const payload = {
                        username : user.fullName,
                        email : user.primaryEmailAddress.emailAddress,
                        profilePictureURL : user.imageUrl,
                        clerkID : user.id
                    }
                    const ExistingUserResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user/${payload.clerkID}/${payload.email}`);

                    if(ExistingUserResponse.data.message === "User not found")
                    {
                        //api call for saving user data
                        const SaveUserResponse = await axios.post(`${process.env.REACT_APP_API_URL}/user`,payload);
                        if(SaveUserResponse.data.success === true){
                            setUserData({
                                user : ExistingUserResponse.data.userData,
                                project : ExistingUserResponse.data.ProjectData
                            })
                            return children;
                        }

                        else
                            alert(SaveUserResponse.data.message)
                    }

                    //console.log(ExistingUserResponse)

                    
                    else if(ExistingUserResponse.data.success === false)
                        alert(ExistingUserResponse.data.message)


                    else if(ExistingUserResponse.data.success === true){
                        setUserData({
                            user : ExistingUserResponse.data.userData,
                            project : ExistingUserResponse.data.ProjectData
                        })
                    }
                    
                    
                    
                }
            } catch (error) {
                console.error('Error during signup or signin:', error);
            }
        }

        handleSignupOrSignin();
        //console.log(isSignedIn)
    }, [isSignedIn, user]);

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    return children;
}

export default PrivateRoute;
