import React, {useState} from "react"
import axios from 'axios'

function Auth() {

    const [loading, setLoading] = useState(true)
    const [permanentCode, setPermanentCode] = useState(false)

    React.useEffect(() => {

        async function getPermanentCode() {

            const temporalCode = new URLSearchParams(window.location.search).get("code")
            console.log(temporalCode);
            
            if (!temporalCode) {
                console.log("No temporal code")
                return
            }

            let requestUrl

            if (process.env.REACT_APP_ENV_MODE === "production") {
                requestUrl = "https://telegram-to-notion-backend.herokuapp.com/api/v1/auth"
            } else {
                requestUrl = "http://localhost:5050/api/v1/auth"
            }

            axios({
                method: "POST",
                url: requestUrl,
                headers: {
                    code: temporalCode,
                }
            })
            .then(res => {
                console.log(res)
                setPermanentCode(res ? res.data : null)
            })
            .catch(err => {
                console.log(err.response)
                setPermanentCode(false)
            })
            .finally(() => {
                setLoading(false)
            })

        }
        
        getPermanentCode()
    })

    
    return (
        <div className="auth">
            {
                loading ?
                    // <Loading />
                    <h1>Loading</h1>
                :
                <>
                    {
                        permanentCode ?
                        <>
                            <h3>Copy the following code on the Telegram chat</h3>
                            <div className="success">
                                <code className="code-selection">
                                    {permanentCode}
                                </code>
                            </div>
                        </>
                        :
                        <div className="error">
                                <h3>There has been an error getting the code. Please try again later.</h3>
                        </div>
                    }
                </>
            }
        </div>
    )
}

export default Auth