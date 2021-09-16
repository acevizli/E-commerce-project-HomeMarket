import React,{useState} from 'react'
import styled from 'styled-components'
import { formatPrice } from '../utils/helpers'
import { FaSearch,FaCartPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useCartContext } from '../context/cart_context'
import { Modal,Button,Row,Col } from 'react-bootstrap'
import ReactImage from 'react-image-wrapper'
import AmountButtons from './AmountButtons'
import Message from './message'
const Product = ({product}) => {
  const increase = () => {
    setAmount((oldAmount) => {
      let tempAmount = oldAmount + 1
      if (tempAmount > product.inStock) {
        tempAmount = product.inStock
      }
      return tempAmount
    })
  }
  const decrease = () => {
    setAmount((oldAmount) => {
      let tempAmount = oldAmount - 1
      if (tempAmount < 1) {
        tempAmount = 1
      }
      return tempAmount
    })
  }
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState(1)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const buttonAction = () => {
    addToCart(product.id, amount, product);
    handleClose();
  }
  const {addToCart} = useCartContext()
  return <Wrapper>
    <div className="container">
          <ReactImage  src={product.image} alt={product.name} width = {250} height = {250} keepAspectRatio={true}></ReactImage>
      <button className='btn' onClick={handleShow}> <FaCartPlus/> </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{product.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Row>
          <Col>
          <ReactImage  src={product.image} alt={product.name} width = {250} height = {250} keepAspectRatio={true}></ReactImage>
          </Col>
          { product.inStock > 0 ? 
        <Col className='p-4'>
        <AmountButtons
          increase={increase}
          decrease={decrease}
          amount={amount}
        />
        <button className='btn' onClick={buttonAction}>
          add to cart
        </button>
        </Col>:<Col  fluid = 'true'><Message variant = {'secondary'}>{'Out of Stock'}</Message></Col>}
        </Row>
          </Modal.Body>
        <Modal.Footer>
          <Col>
          <p>{formatPrice(product.price)}</p>
          </Col>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Link to={`/products/${product.id}`} className='link'>
      <FaSearch />
      </Link>

    </div>
    <footer>
        <h5>{product.name}</h5>
    </footer>
    <p>{formatPrice(product.price)}</p>
  </Wrapper>
}

const Wrapper = styled.article`
  .container {
    position: relative;
    background: var(--clr-black);
    border-radius: var(--radius);
  }
  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border-radius: var(--radius);
    transition: var(--transition);
  }
  .link {
    position: absolute;
    top: 50%;
    left: 35%;
    transform: translate(-50%, -50%);
    background: var(--clr-primary-5);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    transition: var(--transition);  
    opacity: 0;
    cursor: pointer;
    svg {
      font-size: 1.25rem;
      color: var(--clr-white);
    }
  }
  .btn{
    position: absolute;
    top: 50%;
    left: 65%;
    transform: translate(-50%, -50%);
    background: var(--clr-primary-5);
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 2.5rem !important;
    height: 2.5rem;
    border-radius: 50%;
    transition: var(--transition);
    opacity: 0;
    margin: 0px !important;
    cursor: pointer;
    svg {
      font-size: 1.25rem;
      color: var(--clr-white);
    }
  }
  .btn-container {
    margin-top: 2rem;
  }
  .container:hover img {
    opacity: 0.5;
  }
  .container:hover .link {
    opacity: 1;
  }
  .container:hover .btn {
    opacity: 1;
  }
  footer {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  footer h5,
  footer p {
    margin-bottom: 0;
    font-weight: 400;
    font-size: 1rem;
  }
  p {
    color: var(--clr-primary-5);
    letter-spacing: var(--spacing);
  }
  footer p {
    color: var(--clr-primary-5);
    letter-spacing: var(--spacing);
  }
`
export default Product
