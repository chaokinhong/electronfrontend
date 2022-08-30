import React from 'react'
import { Card, Badge, Typography, Button } from 'antd'
import { ContractContext } from '../../context'
import * as xerraFunction from '../../redux/actions/xerra'
import './styles.css'
import { useSelector } from 'react-redux'

const WalletConnect = () => {
  const {
    shortenAddress,
    connectWallet,
    id,
    account,
    myEtrBalance,
    myUsdtBalance,
    myXerraBalance,
  } = React.useContext(ContractContext)
  const reward = useSelector((state) => state.rewardReducer)
  const [myLiquidity, setMyLiquidity] = React.useState(0)
  const [myUsdtStake, setMyUsdtStake] = React.useState(0)

  const networkName = (id) => {
    switch (id) {
      case 1:
        return 'Ethereum mainnet'
      case 3:
        return 'Rospten testnet'
      case 137:
        return 'Polygon mainnet'
      case 4:
        return 'Rinkeby testnet'
      case 56:
        return 'Binance mainnet'
      case 1337:
        return 'Ganache local'
    }
  }
  const init = async () => {
    console.log(reward)
    if (reward.myTokenStake * reward.myEtrStake) {
      setMyLiquidity(Math.sqrt(reward.myTokenStake * reward.myEtrStake))
    } else {
      setMyLiquidity(0)
    }
    const myStake = await xerraFunction.getMyUsdtStake()
    if (myStake) {
      setMyUsdtStake(myStake)
    } else {
      setMyUsdtStake(0)
    }
  }

  React.useState(() => {
    init()
  }, [reward])

  return (
    <div className="grid place-content-center">
      <div className="grid place-content-center">
        <Card
          style={{
            width: '600px',
            height: '450px',
            background: '#ececec',
            boxShadow: '5px 8px 24px 5px rgba(208, 216, 243, 0.6)',
            borderRadius: '20px',
          }}
        >
          <div className="grid place-content-center">
            <Typography.Title underline={true} style={{ color: 'green' }}>
              {' '}
              My Wallet
            </Typography.Title>
          </div>
          <div className="grid grid-rows-4 gap-6">
            {account ? (
              <div className="grid place-content-center">
                <Badge
                  style={{ marginRight: '15px', font: 'message-box' }}
                  status="success"
                  text="Connected"
                />
              </div>
            ) : (
              <div className="grid place-content-center">
                <Badge
                  style={{ marginRight: '15px', font: 'message-box' }}
                  status="error"
                  text="Not Connected"
                />
              </div>
            )}

            <Typography style={{ font: 'message-box', position: 'relative' }}>
              {' '}
              Address: {account}
            </Typography>
            <Typography style={{ font: 'message-box' }}>
              {' '}
              Network: {networkName(id)}
            </Typography>
            <Typography.Text
              style={{ font: 'message-box', fontSize: '14px' }}
              strong
            >
              My USDT : {myUsdtBalance} USDT
            </Typography.Text>
            <Typography.Text
              style={{ font: 'message-box', fontSize: '14px' }}
              strong
            >
              My ETR : {myEtrBalance} ETR
            </Typography.Text>
            <Typography.Text
              style={{ font: 'message-box', fontSize: '14px' }}
              strong
            >
              My Xerra : {myXerraBalance} XRA
            </Typography.Text>
            <Typography.Text
              style={{ font: 'message-box', fontSize: '14px' }}
              strong
            >
              My Liquidity : {myLiquidity} USDT
            </Typography.Text>
            <Typography.Text
              style={{ font: 'message-box', fontSize: '14px' }}
              strong
            >
              My USDT Stake : {myUsdtStake} USDT
            </Typography.Text>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default WalletConnect
