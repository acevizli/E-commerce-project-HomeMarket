import React, { useEffect } from 'react'
import ReactImage from 'react-image-wrapper'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useProductsContext } from '../context/products_context'
import { single_product_url as url } from '../utils/constants'
import { formatPrice } from '../utils/helpers'
import Reviews from './Reviews'
import {
  Loading,
  Error,
  ProductImages,
  AddToCart,
  Stars,
} from '../components'
import styled from 'styled-components'

const SingleProductPage = () => {
  const { id } = useParams()
  const history = useHistory()
  const { single_product_loading: loading, single_product_error: error, single_product: product, fetchSingleProduct } = useProductsContext()

  useEffect(() => {
    fetchSingleProduct(`${url}${id}`)
  }, [id])
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        history.push('/')
      }, 3000)
    }
  }, [error])

  if (loading) {
    return <Loading />
  }
  if (error) {
    return <Error />
  }
  const { name, price, description, inStock, stars, reviews, id: S, brand, image } = product
  return <div className="aa" style={{display : "flex"}}> 
    <Wrapper className="left-page">
      <div className="section section-center page">
        <Link to="/products" className="btn">Back to products</Link>
        <div className="products-center">
          <ReactImage src={image} alt={name} width={250} height={250} keepAspectRatio={true}></ReactImage>
          <section className="content left-page" style={{padding : 0}}>
            <h2>{name}</h2>
            <Stars stars={stars} reviews={reviews ? reviews.length : 0} productID ={parseInt(id)}/>
            <h5 className="price">{formatPrice(price)}</h5>
            <p className="desc">{description}</p>
            <p className="info">
              <span>Available:</span>
              {inStock > 0 ? `In Stock: ${inStock}` : 'Out of Stock'}
            </p>
            <p className="info">
              <span>ID:</span>
              {S}
            </p>
            <p className="info">
              <span>Brand:</span>
              {brand}
            </p>
            <hr />
            {inStock > 0 && <AddToCart product={product} />}
          </section>
        </div>
      </div>
    </Wrapper>
    <Wrapper className="right-page">
      <div className="review-header-container">
        <h1 className="review-header"> Reviews </h1>
      </div>
      <Reviews reviews={reviews}/>
      
    </Wrapper>
  </div>
}

const Wrapper = styled.main`
  .product-center {
    display: grid;
    gap: 4rem;
    margin-top: 2rem;
  }

  .price {
    color: var(--clr-primary-5);
  }
  .desc {
    line-height: 2;
    max-width: 45em;
  }
  .info {
    text-transform: capitalize;
    width: 300px;
    display: grid;
    grid-template-columns: 125px 1fr;
    span {
      font-weight: 700;
    }
  }

  @media (min-width: 992px) {
    .product-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
    .price {
      font-size: 1.25rem;
    }
  }
`

export default SingleProductPage