import { useContext, useState } from "react";
import { createContext } from "react";

const CurrentCodeContext = createContext();

export const CurrentCodeProvider = ({children}) => {
    const [currentCode, setCurrentCode] = useState("//Please select any file to Display its contents");
    const [currentFilePath, setCurrentFilePath] = useState("");

    return(
        <CurrentCodeContext.Provider value={{currentCode, setCurrentCode, currentFilePath, setCurrentFilePath}}>
            {children}
        </CurrentCodeContext.Provider>
    )

}

export const useCurrentCode = () => useContext(CurrentCodeContext)