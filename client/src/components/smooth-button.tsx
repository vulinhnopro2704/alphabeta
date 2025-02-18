import { ButtonProps } from '@/common-type/button-type';
import styled from 'styled-components';

export default function SmoothButton({
    children,
    className,
    onClick,
}: ButtonProps) {
    return (
        <StyledWrapper>
            <button className={className} onClick={onClick}>
                {children}
            </button>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
    button {
        position: relative;
        display: inline-block;
        padding: 8px 15px;
        text-align: center;
        font-size: 18px;
        letter-spacing: 1px;
        text-decoration: none;
        color: #2fe0ff;
        background: transparent;
        cursor: pointer;
        transition: ease-out 0.5s;
        border: 2px solid #2fe0ff;
        border-radius: 10px;
        box-shadow: inset 0 0 0 0 #2fe0ff;
    }

    button:hover {
        color: #131f24;
        box-shadow: inset 0 -100px 0 0 #2fe0ff;
    }

    button:active {
        transform: scale(0.9);
    }
`;
