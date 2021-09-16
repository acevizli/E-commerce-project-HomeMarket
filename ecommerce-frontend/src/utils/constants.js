import React from 'react'
import { GiCompass, GiDiamondHard, GiStabbedNote } from 'react-icons/gi'
export const links = [
  {
    id: 1,
    forProductManager:false,
    forSalesManager:false,
    text: 'home',
    url: '/',
  },
  {
    id: 2,
    forProductManager:false,
    forSalesManager:false,
    text: 'products',
    url: '/products',
  },
  {
    id: 3,
    forProductManager:true,
    forSalesManager:true,
    text: 'Products',
    url: '/admin/products',
  },
  {
    id: 4,
    forProductManager:false,
    forSalesManager:true,
    text: 'Users',
    url: '/admin/users',
  },
  {
    id: 5,
    forProductManager:true,
    forSalesManager:true,
    text: 'Orders',
    url: '/admin/orders',
  },
  {
    id: 6,
    forProductManager:true,
    forSalesManager:false,
    text: 'Reviews',
    url: '/admin/reviews',
  },
]

export const products_url = '/api/products/'

export const single_product_url = `/api/products/`

export const image_url = `/static`
