import {
  Button,
  Card,
  Form,
  Modal,
  Typography,
  Input,
  Avatar,
  Menu,
  Image,
  Spin,
} from 'antd'
import * as reduxfunction from '../../redux/actions/pre'
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import WalletConnect from '../ConnectWallet'
import { Link } from 'react-router-dom'
import React from 'react'
import ElectronMarket from './ElectronMarket'

const PowerPlant = () => {
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
         Power Plant
        </Menu.Item>
        <Menu.Item icon={<AppstoreOutlined />} key={2}>
          My Wallet
        </Menu.Item>
      </Menu>
      <Card
        style={{ width: '100vw', height: '200px', backgroundColor: '#3a65a6' }}
      >
        <div className="grid grid-rows-3 grid-cols-2 place-content-center">
          <div></div>
          <div></div>
          <div className="grid row-span-2 grid-rows-2 place-content-center ">
            <Typography.Title style={{ color: 'white' }} level={3}>
              Virtual Power Plant
            </Typography.Title>
            <Typography.Text style={{ color: 'white' }}>
              Lock your electricity and get Token
            </Typography.Text>
          </div>
        </div>
      </Card>

      <div className="grid place-content-center -translate-y-9">
       {curPage==1 &&<ElectronMarket />}
      </div>
      {curPage == 2 && <WalletConnect />}
    </div>
  )
}

export default PowerPlant
