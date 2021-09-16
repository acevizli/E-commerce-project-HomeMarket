import React from 'react'
import ReactDOM from 'react-dom'

import "./Styles/stylesheet.css"
import "./index.css"
import "./bootstrap.min.css"
import App from './App'
import { ProductsProvider } from './context/products_context'
import { FilterProvider } from './context/filter_context'
import { CartProvider } from './context/cart_context'
import store from './store'
import { Provider } from 'react-redux'

ReactDOM.render(
<ProductsProvider>
<FilterProvider>
    <CartProvider>
    <Provider store={store}>
    <App />
    </Provider>
    </CartProvider>
    </FilterProvider>
    
</ProductsProvider>, 
document.getElementById('root'))
