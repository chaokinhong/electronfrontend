import React from 'react'
import { Form, Menu, Typography, Input, Avatar, Button } from 'antd'
import { Link } from 'react-router-dom'
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useSelector } from 'react-redux'
import AddModal from './AddModal'
import RedeemModal from './RedeemModal'

// form item: name label rules
const LiquidityMining = () => {
  const itemStyle = {
    backgroundColor: '#ebebf0',
    borderRadius: '5px',
    padding: '5px 20px 5px 20px',
    width: '100%',
    textAlign: 'right',
    fontWeight: '700',
  }
  const [lpForm] = Form.useForm()
  const pre = useSelector((state) => state.preReducer)
  const reward = useSelector((state) => state.rewardReducer)
  const [showAdd,setShowAdd] = React.useState(false)
  const [showRedeem,setShowRedeem] = React.useState(false)
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
      <div className="grid place-content-center mt-5">
        <Form form={lpForm}>
          <Typography.Title level={3}>Pool Overview</Typography.Title>

          <Form.Item label="Total Liquidity" style={itemStyle}>
            {parseFloat(Math.sqrt(pre.usdt * pre.etr)).toFixed(2)}
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', fontWeight: '700' }}>
            <Input
            readOnly
              prefix={
                <div className="grid place-content-center grid-cols-2 h-full w-full">
                  <Avatar src="https://img.icons8.com/color/2x/tether--v2.png" />
                  <p className="grid place-content-center h-full font-bold text-slate-500">
                    USDT
                  </p>
                </div>
              }
              style={{
                textAlign: 'right',
                textAlignLast: 'right',
                color: 'black',
              }}
              value={parseFloat(pre.usdt).toFixed(2)}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', fontWeight: '700' }}>
            <Input
            readOnly
              prefix={
                <div className="grid place-content-center grid-cols-2 h-full w-full">
                  <Avatar src="https://img.icons8.com/external-creatype-flat-colourcreatype/344/external-electron-science-education-flat-creatype-flat-colourcreatype.png" />
                  <p className="grid place-content-center h-full text-slate-500 font-bold">
                    ETR
                  </p>
                </div>
              }
              style={{
                textAlign: 'right',
                textAlignLast: 'right',
                color: 'black',
              }}
              value={parseFloat(pre.etr).toFixed(2)}
            />
          </Form.Item>
          <Typography.Title level={3}>My Liquidity</Typography.Title>
          <Form.Item label="LiquidityUSDT" style={itemStyle}>
            {parseFloat(
              Math.sqrt(reward.myTokenStake * reward.myEtrStake),
            ).toFixed(2) || 0}
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', fontWeight: '700' }}>
            <Typography.Text style={{color:'gray'}}>{parseFloat(reward.myXerra).toFixed(2)} USDT in XRA</Typography.Text>
            <Input
            readOnly
              prefix={
                <div className="grid place-content-center grid-cols-2 h-full w-full">
                  <Avatar src="https://img.icons8.com/color/2x/tether--v2.png" />
                  <p className="grid place-content-center h-full font-bold text-slate-500">
                    USDT
                  </p>
                </div>
              }
              style={{
                textAlign: 'right',
                textAlignLast: 'right',
                color: 'black',
              }}
              value={parseFloat(reward.myTokenStake).toFixed(2)}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', fontWeight: '700' }}>
            <Input
            readOnly
              prefix={
                <div className="grid place-content-center grid-cols-2 h-full w-full">
                  <Avatar src="https://img.icons8.com/external-creatype-flat-colourcreatype/344/external-electron-science-education-flat-creatype-flat-colourcreatype.png" />
                  <p className="grid place-content-center h-full text-slate-500 font-bold">
                    ETR
                  </p>
                </div>
              }
              style={{
                textAlign: 'right',
                textAlignLast: 'right',
                color: 'black',
              }}
              value={parseFloat(reward.myEtrStake).toFixed(2)}
            />
          </Form.Item>
          <Form.Item>
            <div className='grid grid-cols-2 place-content-between gap-14'>
                <Button type='primary' onClick={()=> setShowAdd(true)} style={{height:'37px' , borderRadius:'5px',fontWeight:'500'}}>
                    Add
                </Button>
                <Button type='default' onClick={()=>setShowRedeem(true)} style={{height:'37px' , borderRadius:'5px', borderColor:'green', color:'green',fontWeight:'500'}}>
                    Redeem
                </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
      <AddModal showAdd={showAdd} setShowAdd={setShowAdd}/>
      <RedeemModal showRedeem={showRedeem} setShowRedeem={setShowRedeem}/>
    </div>
  )
}

export default LiquidityMining
