import React from 'react'
import { SwapWidget } from '@uniswap/widgets'
import { ContractContext } from '../../context'
import { Card, Spin } from 'antd'
import WalletConnect from '../ConnectWallet'
import { ethers } from 'ethers'
import '@uniswap/widgets/fonts.css'

const Bank = () => {
  const { provider, infuraId, library, shortenAddress,spinning } = React.useContext(
    ContractContext,
  )

  const id = 'https://speedy-nodes-nyc.moralis.io/0b4ffd15c6d8d676aa9b7922/eth/rinkeby'

  return (
    <Spin spinning={spinning} tip='waiting the liquidity reach the target...'>
    <div className="Uniswap grid place-content-center mt-48">
      <div className="grid grid-cols-2 gap-10">
        <SwapWidget provider={library} jsonRpcEndpoint={infuraId} />
        <WalletConnect />
      </div>
    </div>
    </Spin>
  )
}

export default Bank
