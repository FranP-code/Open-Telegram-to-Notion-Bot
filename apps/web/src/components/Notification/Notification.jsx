import React from 'react'

import './notification-style.css'

const Notification = ({notification, setNotification}) => {
    React.useEffect(() => {
        if (notification === false) {
            return
        }

        setTimeout(() => {
            const elem = document.querySelector("#notification-element")
            elem.classList.remove('fade-in')
            elem.classList.add('fade-out')
        }, 2000)

        setTimeout(() => {
            setNotification(false)
        }, 2400)

    }, [notification])
    
    return (
        <>
            {
                notification ?
                    <div className="notification fade-in" id="notification-element">
                        <p>{notification}</p>
                    </div>
                : null
            }
        </>
  )
}

export default Notification