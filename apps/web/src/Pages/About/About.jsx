import React from 'react'
import styled from 'styled-components'
import { Link } from 'wouter'

const About = () => {

    const Style = styled.main`
        padding: 0px 3vw;

        section {
            margin-bottom: 5vh;
        }

        a {
            color: #4d77ff
        }
    `

    return (
        <Style>
            <section>
                <h2>What is this?</h2>
                <p>This is a <strong>Telegram Bot</strong> that allow you send text messages and add it to one selected Notion Database. Principally useful for mobile users.</p>
            </section>
            <section>
                <h2>I want to send you feedback, questions or some critic</h2>
                <p>You can send it to me to my email: <strong>franpessano1@gmail.com</strong></p>
            </section>
            <section>
                <h2>I want to ignore some database of Notion on the Bot</h2>
                <p>For force to the bot to ignore some database, add to it a propierty called <code style={{color: '#fd6565'}}>telegramIgnore</code> of any type.</p>
            </section>
            <section>
                <h2>Is this afiliated with Notion or Telegram?</h2>
                <p>Nope, this is not affiliated with Notion or Telegram in any way. This is just a app developed of a fanboy of Telegram and Notion open for the wide world.</p>
            </section>
            <section>
                <h2>Where is the source code?</h2>
                <p>On GitHub.</p>
                <ul>
                    <li>Here is for <Link href='https://github.com/FranP-code/Telegram-to-Notion-Bot'>the bot itself</Link></li>
                    <li>Here is for <Link href='https://github.com/FranP-code/Telegram-to-Notion-Website'>the frontend (this page)</Link></li>
                    <li>Here is for <Link href='https://github.com/FranP-code/Telegram-to-Notion-Backend'>the backend</Link></li>
                </ul>
            </section>
        </Style>
    )
}

export default About