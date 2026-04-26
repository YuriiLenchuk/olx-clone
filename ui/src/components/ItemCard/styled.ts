import styled from "styled-components";


const StyledCard = styled.div`
    width: 100%;
    height: 144px;
    background-color: #fff;
    border-radius: 5px;
    border: none;
    margin: 5px 0;
    padding: 8px;
    display: flex;
    position: relative;
`

const StyledProductImgDiv = styled.div`
    aspect-ratio: 12/9;
    height: 128px;
    width: 100%;
    max-width: 216px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #fff;
    border-top-left-radius: 4px;
`

const StyledProductImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

const StyledProductTitle = styled.div`
    padding-left: 10px;
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    margin: 5px 0;
`

const StyledProductName = styled.h4`
    font-weight: 400;
    font-size: 18px;
`

const StyledProductDescription = styled.p`
    font-size: 12px;
    line-height: 14px;
    font-weight: 300;
    color: #223335;
`

const StyledProductPrice = styled.p`
    padding: 0 10px;
    font-weight: 700;
    font-size: 16px;
    margin-top: auto;
`

const StyledProductLike = styled.button`
    appearance: none;
    background: none;
    border: none;
    z-index: 5;
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 5px 15px;
    display: flex;
    gap: 4px;
    cursor: pointer;
    span{
        opacity: 0;
        color: #02282C;
        font-size: 14px;
        margin: auto;
    }
    &:hover > span {
        opacity: 100;
    }
`

const StyledProductWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`
export {
    StyledCard,
    StyledProductImg,
    StyledProductImgDiv,
    StyledProductTitle,
    StyledProductName,
    StyledProductDescription,
    StyledProductPrice,
    StyledProductLike,
    StyledProductWrapper,
}