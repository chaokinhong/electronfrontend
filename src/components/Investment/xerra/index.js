import React from 'react'
import { Menu, Typography, Card } from 'antd'
import { useSelector } from 'react-redux'
import { MailOutlined, AppstoreOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import BuyCard from './buyCard'

const XerraInvest = () => {
    
  const xerra = useSelector((state) => state.xerraDataReducer)
  
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item icon={<AppstoreOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item icon={<AppstoreOutlined />}>
          <Link to="/investment">Investment</Link>
        </Menu.Item>
      </Menu>
      <div className="grid place-content-center">
        <Card
          style={{
            height: '200px',
            width: '100vw',
            boxShadow: 'inherit',
            backgroundColor: '#360a30',
          }}
        >
          <div className="grid place-content-center" style={{ width: '90vw' }}>
            <div className="grid grid-cols-2 place-content-center">
              <div className="grid grid-rows-2 place-content-center">
                <Typography.Title style={{ color: 'white' }} level={2}>
                  Xerra Electron Protocol
                </Typography.Title>
                <Typography.Text style={{ color: 'white' }}>
                  Invest like stock, buy a share of xerra
                </Typography.Text>
              </div>
              <div className=" grid   place-content-center  " style={{ marginLeft: '100%' }}>
                <Card
                  style={{
                    backgroundColor: '#360a30',
                    height: '120px',
                    width: '300px',
                    borderRadius: '10px',
                  }}
                >
                  <div className="grid grid-rows-2 place-content-start">
                    <Typography.Title style={{ color: 'white' }} level={5}>
                      Currnet XRA Price
                    </Typography.Title>
                    <Typography.Text
                      style={{ color: 'white', fontSize: '23px' }}
                      strong
                    >
                      {parseFloat(xerra.usdt / xerra.xerra).toFixed(7)} USDT/XRA
                    </Typography.Text>
                  </div>
                </Card>
        
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid place-content-center -translate-y-8">
      <BuyCard/>
      </div>
    </div>
  )
}

export default XerraInvest
