import { useAuth, useUser } from "@clerk/clerk-react";
import { createContext, useContext, useState } from "react";
import axios from "axios";

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        user: null,
        project: null
    });

    const {user} = useUser();
    const { isSignedIn } = useAuth();


    async function makeAPICall() {
        try {
            if (isSignedIn) {

                const payload = {
                    username: user.fullName,
                    email: user.primaryEmailAddress.emailAddress,
                    profilePictureURL: user.imageUrl,
                    clerkID: user.id
                }
                const ExistingUserResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user/${payload.clerkID}/${payload.email}`);

                if (ExistingUserResponse.data.message === "User not found") {
                    //api call for saving user data
                    const SaveUserResponse = await axios.post(`${process.env.REACT_APP_API_URL}/user`, payload);
                    if (SaveUserResponse.data.success === true) {
                        setUserData({
                            user: ExistingUserResponse.data.userData,
                            project: ExistingUserResponse.data.ProjectData
                        })
                        return children;
                    }

                    else
                        alert(SaveUserResponse.data.message)
                }

                //console.log(ExistingUserResponse)


                else if (ExistingUserResponse.data.success === false)
                    alert(ExistingUserResponse.data.message)


                else if (ExistingUserResponse.data.success === true) {
                    setUserData({
                        user: ExistingUserResponse.data.userData,
                        project: ExistingUserResponse.data.ProjectData
                    })
                }



            }
        } catch (error) {
            console.error('Error during signup or signin:', error);
        }
    }

    return (
        <UserDataContext.Provider value={{ userData, setUserData , makeAPICall}}>
            {children}
        </UserDataContext.Provider>
    )
}

export const useUserData = () => useContext(UserDataContext);