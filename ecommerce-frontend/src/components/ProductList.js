import React from 'react'
import { useFilterContext } from '../context/filter_context'
import GridView from './GridView'


const ProductList = () => {
  const {filtered_products:products} = useFilterContext()
  return <GridView products={products}>product list</GridView>
}

export default ProductList
