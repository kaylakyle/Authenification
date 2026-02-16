import { createContext } from "react";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [UserData, setIsUserData] = useState(false)
    const value = {
           backendUrl,
           isLoggedIn,
           setIsLoggedIn,
           UserData,
           setIsUserData
    }
    return (
        <AppContext.Provider value={{}}>
            {props.children}
        </AppContext.Provider>
    )
}

