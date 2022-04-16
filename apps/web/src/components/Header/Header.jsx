import icon from './icon.png'
import styled from 'styled-components'

function Header() {

    const HeaderStyles = styled.header`
        
        height: 15vh;

        display: flex;
        align-items: center;

        padding: 0px 2vw;

        border-bottom: 1px solid #eee;

        .logotype {
            display: flex;
            align-items: center;
            
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

    `
    
    return (
        <HeaderStyles>
            <div className='logotype'>
                <img src={icon} alt="Page icon"></img>
                <h1>Telegram to Notion Bot</h1>
            </div>
            <div>

            </div>
        </HeaderStyles>
    )
}

export default Header