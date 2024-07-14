import { useContext, useState } from "react";
import { createContext } from "react";

const CurrentCodeContext = createContext();

export const CurrentCodeProvider = ({children}) => {
    const [currentCode, setCurrentCode] = useState("//Please select any file to Display its contents");
    const [currentFilePath, setCurrentFilePath] = useState("");
    const [projectPath, setprojectPath] = useState("");
    const [currentFolder, setcurrentFolder] = useState("");

    return(
        <CurrentCodeContext.Provider value={{currentCode, setCurrentCode, currentFilePath, setCurrentFilePath, projectPath, setprojectPath, currentFolder, setcurrentFolder}}>
            {children}
        </CurrentCodeContext.Provider>
    )

}

export const useCurrentCode = () => useContext(CurrentCodeContext)