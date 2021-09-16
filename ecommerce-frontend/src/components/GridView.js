import React from 'react'
import styled from 'styled-components'
import Product from './Product'

const GridView = ({ products }) => {
  return (
    <Wrapper>
      <div className='grid'>
        {products.map((product) => {
          return <Product product={product} />
        })}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  .products-container {
    display: grid;
    gap: 2rem 1.5rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    grid-gap: 2rem 2rem;
  }
  @media (min-width: 360px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 380px) {
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }
  }
  .grid > div {
    background: black;
    padding: 1rem;
  }
  .grid > div::before {
    content: "";
    padding-bottom: 100%;
    display: block;
  }
  @media (min-width: 992px) {
    .products-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 1170px) {
    .products-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`

export default GridView
