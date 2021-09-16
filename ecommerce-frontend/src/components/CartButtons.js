import React, { useState } from 'react'
import { FaShoppingCart, FaUserMinus, FaUserPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useProductsContext } from '../context/products_context'
import { useCartContext } from '../context/cart_context'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../pages/Modal'
const CartButtons = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { closeSideBar } = useProductsContext()
  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin
  const { total_items } = useCartContext()
  return <Wrapper className="cart-btn-wrapper">
    {(!userInfo || !userInfo.isAdmin) && <Link to="/cart" className="cart-btn" onClick={closeSideBar}>
      Cart
      <span className="cart-container">
        <FaShoppingCart />
        <span className="cart-value">
          {total_items}
        </span>
      </span>
    </Link>}
    {userInfo ? <button className="auth-btn" onClick={() => setIsOpen(true)}>
      {userInfo.username} </button>  : <Link type="button" className="auth-btn" to="/login">
        Login <FaUserPlus></FaUserPlus></Link>
    }
    <Modal open={isOpen} onClose={() => setIsOpen(false)}/>

  </Wrapper>
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: 225px;

  .cart-btn {
    color: var(--clr-grey-1);
    font-size: 1.5rem;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-1);
    display: flex;
    padding-right: 30px;
    align-items: center;
  }
  .cart-container {
    display: flex;
    align-items: center;
    position: relative;  
    svg {
      height: 1.6rem;
      margin-left: 5px;
      
    }
  }
  .cart-value {
    position: absolute;
    top: -10px;
    right: -16px;
    background: var(--clr-primary-5);
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;
    color: var(--clr-white);
    padding: 12px;
  }
  .auth-btn {
    display: flex;
    align-items: center;
    background: transparent;
    border-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--clr-grey-1);
    letter-spacing: var(--spacing);
    
    
    svg {
      margin-left: 5px;
    }
  }
`
export default CartButtons
