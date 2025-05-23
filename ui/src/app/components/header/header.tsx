'use client'

import {StyledHeader, WrapperLink, Button} from './styled'
import Image from "next/image";
import logo from './img.png'
export default function Header () {
    return <StyledHeader>
        <a>
            <Image
                src={logo}
                width={84}
                height={42}
                alt={"logo"}
            />
        </a>
        <div style={{ display: "flex", flexFlow: 'row' }}>
            <WrapperLink href='/wish-list'>
                <svg xmlns='./ico.svg' color='white' viewBox="0 0 24 24" width="1.5em" height="1.5em">
                    <path fill="currentColor" fillRule="evenodd"
                          d="M20.219 10.367 12 20.419 3.806 10.4A3.96 3.96 0 0 1 3 8c0-2.206 1.795-4 4-4a4.004 4.004 0 0 1 3.868 3h2.264A4.003 4.003 0 0 1 17 4c2.206 0 4 1.794 4 4 0 .868-.279 1.698-.781 2.367M17 2a5.999 5.999 0 0 0-5 2.686A5.999 5.999 0 0 0 7 2C3.692 2 1 4.691 1 8a5.97 5.97 0 0 0 1.232 3.633L10.71 22h2.582l8.501-10.399A5.943 5.943 0 0 0 23 8c0-3.309-2.692-6-6-6"></path>
                </svg>
            </WrapperLink>
            <WrapperLink href='/registration'>
                <svg xmlns='./ico2.svg' color='white' viewBox="0 0 24 24" width="1.5em" height="1.5em">
                    <path fill="currentColor" fillRule="evenodd"
                          d="M12 12c4.963 0 9 4.038 9 9l-1 1H4l-1-1c0-4.962 4.037-9 9-9zm0 2c-3.52 0-6.442 2.613-6.929 6H18.93c-.487-3.387-3.409-6-6.93-6zm0-12c2.481 0 4.5 2.019 4.5 4.5 0 2.482-2.019 4.5-4.5 4.5a4.505 4.505 0 0 1-4.5-4.5C7.5 4.019 9.519 2 12 2zm0 2a2.503 2.503 0 0 0-2.5 2.5C9.5 7.878 10.621 9 12 9s2.5-1.122 2.5-2.5S13.379 4 12 4z"></path>
                </svg>
                Ваш профіль
            </WrapperLink>
            <Button>Додати оголошення</Button>
        </div>
    </StyledHeader>
}