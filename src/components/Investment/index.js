import React from 'react'
import { Card, Form, Menu, Typography } from 'antd'
import { Link } from 'react-router-dom'
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useSelector } from 'react-redux'
import WalletConnect from '../ConnectWallet'

const MyBox = (props) => {
  return (
    <Link to={props.title.split(' ').join('').toLowerCase()}>
      <div className=" flex-initial w-72 h-32  rounded-3xl drop-shadow-lg ">
        <Card.Grid style={{ height: '100%', width: '100%' }}>
          <div className="grid grid-rows-2 h-full  ">
            <Typography.Title level={5}>{props.title}</Typography.Title>
            <Typography.Text>{props.content}</Typography.Text>
          </div>
        </Card.Grid>
      </div>
    </Link>
  )
}

const Investment = () => {
  const data = useSelector((state) => state.rewardReducer)
  const pre = useSelector((state) => state.preReducer)
  const [curPage, setCurPage] = React.useState(1)

  const handlePage = (e) => {
    setCurPage(e.key)
  }
  return (
    <div>
      <Menu mode="horizontal" onClick={handlePage}>
        <Menu.Item icon={<AppstoreOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item icon={<AppstoreOutlined />} key={1}>
          Investment
        </Menu.Item>
        <Menu.Item icon={<AppstoreOutlined />} key={2}>
          My Wallet
        </Menu.Item>
      </Menu>

      <div className="grid place-content-center">
        <Card
          style={{
            height: '200px',
            width: '100vw',
            boxShadow: 'inherit',
            backgroundColor: '#e3dd22',
          }}
        >
          <div className="grid place-content-center" style={{ width: '90vw' }}>
            <div className="grid grid-cols-2 place-content-center">
              <div className="grid grid-rows-2 place-content-center">
                <Typography.Title style={{ color: 'white' }} level={2}>
                  Liquidity Mining and Investment
                </Typography.Title>
                <Typography.Text style={{ color: 'white' }}>
                  Earn income from fees by providing Dual-Assets liquidity to
                  the market
                </Typography.Text>
              </div>
              <div className=" grid grid-cols-2 place-content-center gap-9 ">
                <Card
                  style={{
                    backgroundColor: '#e3dd22',
                    height: '120px',
                    width: '300px',
                    borderRadius: '10px',
                  }}
                >
                  <div className="grid grid-rows-2 place-content-start">
                    <Typography.Title style={{ color: 'white' }} level={5}>
                      Currnet ETR Price
                    </Typography.Title>
                    <Typography.Text
                      style={{ color: 'white', fontSize: '23px' }}
                      strong
                    >
                      {parseFloat(pre.usdt / pre.etr).toFixed(9)} USDT/ETR
                    </Typography.Text>
                  </div>
                </Card>
                <Card
                  style={{
                    backgroundColor: '#e3dd22',
                    height: '120px',
                    width: '300px',
                    borderRadius: '10px',
                  }}
                >
                  <div className="grid grid-rows-3 place-content-start">
                    <Typography.Title style={{ color: 'white' }} level={5}>
                      Accumulated Reward pool
                    </Typography.Title>
                    <Typography.Text
                      style={{ color: 'white', fontSize: '23px' }}
                      strong
                    >
                      {parseFloat(data.totalRewardBalance).toFixed(9)} USDT
                    </Typography.Text>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </div>
      {curPage == 1 && (
        <div className="flex flex-row place-content-center gap-6 mt-10  ">
          <MyBox
            title="Liquidity Mining"
            content="Earn income from fees by providing Dual-Assets liquidity to
                  the market"
          />
          <MyBox title="Xerra Crypto" content="Invest in Xerra crypto" />
          <MyBox title="USDT stake" content="Stake USDT , earn 10% APY" />
        </div>
      )}
      {curPage == 2 && <WalletConnect />}
    </div>
  )
}

export default Investment
