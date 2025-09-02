import icon from './icon.png'
import styled from 'styled-components'
import { Link } from 'wouter'

function Header() {

    const HeaderStyles = styled.header`
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 3vh 2vw;

        border-bottom: 1px solid #eee;

        user-select: none;
        
        .logotype {
            display: flex;
            align-items: center;
            cursor: pointer;
            
            img {
                width: 80px;
                height: 80px;

                margin-right: 1vw;
                
                &:hover {
                    animation: rotate-image 0.5s cubic-bezier(1.000, 0.000, 0.000, 1.000) both;
                }
            }

            @keyframes rotate-image {
                0% {
                    transform: rotate(0deg)
                }

                100% {
                    transform: rotate(360deg)
                }
            }
        }

        .links {
            display: flex;
            flex-direction: column;

            a {
                color: #000;
                font-weight: bold;
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
        }

    `

    return (
        <HeaderStyles>
            <Link href='/'>
                <div className='logotype'>
                    <img src={icon} alt="Page icon"></img>
                    <h1>Open Telegram to Notion Bot</h1>
                </div>
            </Link>
            <div className="links">
                <Link href="/about">
                    About
                </Link>
                <Link href="/privacy-policy">
                    Privacy policy
                </Link>
                <Link href="/terms-of-use">
                    Terms of use
                </Link>
            </div>
        </HeaderStyles>
    )
}

export default Header