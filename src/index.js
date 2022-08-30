import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { HashRouter } from 'react-router-dom'
import Router from './router'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import reducers from './redux/reducers'
import { ContractProvider } from './context'

const store = configureStore({ reducer: reducers })

ReactDOM.render(
  <HashRouter>
    <Provider store={store}>
      <ContractProvider>
        <Router />
      </ContractProvider>
    </Provider>
  </HashRouter>,
  document.getElementById('root'),
)
