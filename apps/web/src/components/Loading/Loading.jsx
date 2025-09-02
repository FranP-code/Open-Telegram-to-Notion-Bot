import React from 'react'
import styled from 'styled-components'
import {DotSpinner} from '@uiball/loaders'

const Loading = () => {
  
    const Styles = styled.div`
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        box-sizing: border-box;

        padding-bottom: 20vh;

        * {
            width: 10vw !important;
            height: 10vw !important;
        }
    `
    return (
        <Styles>
            <DotSpinner color="#4797ff"/>
        </Styles>
  )
}

export default Loading