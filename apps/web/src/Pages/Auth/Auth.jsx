import React, {useState} from "react"
import axios from 'axios'

import Loading from "../../components/Loading/Loading"

import authImage from './auth_copy.svg' 

import './auth-style.css'
import Notification from "../../components/Notification/Notification"

function Auth() {

    const [loading, setLoading] = useState(true)
    const [permanentCode, setPermanentCode] = useState(false)
    const [notification, setNotification] = useState(false)

    const getPermanentCode = () => {

        const temporalCode = new URLSearchParams(window.location.search).get("code")
        
        if (!temporalCode) {
            setPermanentCode("empty")
            setLoading(false)
            return
        }

        let requestUrl

        if (process.env.REACT_APP_ENV_MODE === "production") {
            requestUrl = "https://open-telegram-to-notion-backend.up.railway.app/api/v1/auth"
        } else {
            requestUrl = "http://localhost:5050/api/v1/auth"
        }

        axios({
            method: "POST",
            url: requestUrl,
            headers: {'Content-Type': 'application/json'},
            data: {code: temporalCode}
        })
        .then(res => {
            setPermanentCode(res ? res.data.access_token : null)
        })
        .catch(err => {
            console.log(err)
            setPermanentCode(false)
        })
        .finally(() => {
            setLoading(false)
        })
    }
    React.useEffect(() => {
        getPermanentCode()
    }, [])

    
    return (
        <div className="auth fullscreen">
            {
                loading ?
                    <Loading />
                :
                <>
                    {
                        permanentCode && permanentCode !== "empty" ?
                            <>
                                <h2>Copy the following code on Telegram chat</h2>
                                <div className="success">
                                    <img src={authImage} alt="Copy text" />
                                    <code
                                        className="code-selection"
                                        onClick={() => {
                                            navigator.clipboard.writeText(permanentCode).then(() => {  
                                                setNotification("Text copied to clipboard!")
                                            })
                                        }}
                                    >
                                        {permanentCode}
                                    </code>
                                </div>
                            </>
                        :
                            <>
                                {
                                    permanentCode === "empty" ?
                                        <div className="error">
                                            <h3>There is no temporal code. Please try again later.</h3>
                                        </div>
                                    :
                                        <div className="error">
                                            <h3>There has been an error getting the code. Please try again later.</h3>
                                        </div>
                                }
                            </>
                    }
                </>
            }
            <Notification notification={notification} setNotification={setNotification}/>
        </div>
    )
}

export default Auth
