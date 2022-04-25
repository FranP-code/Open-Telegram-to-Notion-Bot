import background from './background.svg'
import styled from "styled-components"

function Index() {

    const IndexStyles = styled.div`

        height: calc(100vh - 15vh - 1px); //Minus header height and 1 pixel for prevent scrollbar
        width: 100%;

        display: flex;
        flex-direction: column;

        aspect-ratio: 960/300;

        background-image: url(${background});
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;

        .title-list {

            color: #000;

            li {

                display: flex;
                align-items: flex-end;

                margin-bottom: 1vh;
                
                a {

                    width: fit-content;
                    color: #000;
                    text-decoration: none;
                    
                    &:hover h2 {
                        text-decoration: underline!important;
                    }
                }
                    
                h2 {
                    display: inline-block;
                    margin: 0;
                    font-size: 25pt;
                }

                span {
                    display: inline-block;
                    
                    color: #999;

                    margin-top: 5px;
                    
                    align-self: center;
                }
            }
        }

        .link-to-bot {

            width: fit-content;

            color: #fff;
            background-color: #4797ff;

            border-radius: 5px;

            margin-top: 3vh;
            margin-left: 1vw;
            padding: 3vh 6vw;

            font-size: 20pt;
            font-weight: bold;
            text-decoration: none;

            transition: 0.4s ease-in-out;

            &:hover {
                background-color: #0088cc;
                transition: 0.4s ease-in-out;
            }
        }
    `

    const listData = [
        {text: "Free"},
        {text: "Open Source", link: "https://github.com/FranP-code/Telegram-to-Notion-Bot"},
        {text: "Unlimited"},
        {text: "Forever", secondaryText: "(while I can afford it)"}
    ]

    return (
        <IndexStyles className="index">
            <ul className="title-list">
                {
                    listData.map((obj, index) => (
                        <li key={index}>
                            {obj.link ? <a href={obj.link} target="_blank" children={<h2>› {obj.text}</h2>} rel="noreferrer"/> : <h2>› {obj.text}</h2>}
                            {obj.secondaryText ? <span>&nbsp;{obj.secondaryText}</span> : null}
                        </li>
                    ))
                }
            </ul>
            <a className="link-to-bot" href="https://t.me/TelegrmToNotionBot" target="_blank" children="Check it out" rel="noreferrer"/>
        </IndexStyles>
    )
}

export default Index