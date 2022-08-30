import React from 'react'
import { Menu, Card, Form, Spin, Typography } from 'antd'
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import Buy from './Buy'
import { Link } from 'react-router-dom'
import ElectricityMarket from './ElectricityMarket'
import { ContractContext } from '../../context'
import WalletConnect from '../ConnectWallet'

const Market = () => {
  const [curPage, setCurPage] = React.useState(1)
  const handlePage = (e) => {
    setCurPage(e.key)
  }

  const { spinning } = React.useContext(ContractContext)

  return (
    <div>
      <Menu mode="horizontal" onClick={handlePage} defaultSelectedKeys={1}>
        <Menu.Item icon={<AppstoreOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key={1} icon={<MailOutlined />}>
          Crypto Market
        </Menu.Item>
        <Menu.Item key={2} icon={<AppstoreOutlined />}>
          Electricity Market
        </Menu.Item>
        <Menu.Item key={3} icon={<AppstoreOutlined />}>
          My Wallet
        </Menu.Item>
      </Menu>
      <Card
        style={{ width: '100vw', height: '200px', backgroundColor: '#3e4045' }}
      >
        <div className="grid grid-rows-3 grid-cols-2 place-content-center">
          <div></div>
          <div></div>
          <div className="grid row-span-2 grid-rows-2 place-content-center ">
            <Typography.Title style={{ color: 'white' }} level={3}>
              Flash swap
            </Typography.Title>
            <Typography.Text style={{ color: 'white' }}>
              Fast, Simple and Convenient
            </Typography.Text>
          </div>
        </div>
      </Card>
      {curPage == 1 && (
        <div className="-translate-y-8 grid place-content-center ">
          <Buy />
        </div>
      )}

      {curPage == 2 && (
        <div className="-translate-y-8 grid place-content-center ">
          <ElectricityMarket />
        </div>
      )}
       {curPage == 3 && <WalletConnect />}
    </div>
  )
}

export default Market
