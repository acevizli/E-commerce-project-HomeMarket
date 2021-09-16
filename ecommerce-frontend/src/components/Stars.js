import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs'
import Rate from './Rate/Rate'

const Stars = ({ stars, productID,  }) => {
  const [isOpen, setIsOpen] = useState(false)
  const tempStars = Array.from({ length: 5 }, (_, index) => {
    const number = index + 0.5
    return (
      <span key={index}>
        {stars > number ? (
          <BsStarFill />
        ) : stars > index ? (
          <BsStarHalf />
        ) : (
          <BsStar />
        )}
      </span>
    )
  })
  return (
    <Wrapper>
      <div className='stars'><button className="borderless" onClick={() => setIsOpen(true)}>{tempStars}</button></div>
      <div><Rate productID = {productID} open={isOpen} onClose={() => setIsOpen(false)}/></div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  span {
    color: #ffb900;
    font-size: 1rem;
    margin-right: 0.25rem;
  }
  p {
    margin-left: 0.5rem;
    margin-bottom: 0;
  }
  margin-bottom: 0.5rem;
`
export default Stars
