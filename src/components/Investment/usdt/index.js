import React from 'react'
import { Menu, Typography, Card, Form, Input, Avatar, Button } from 'antd'
import { useSelector } from 'react-redux'
import { MailOutlined, AppstoreOutlined } from '@ant-design/icons'
import { ethers } from 'ethers'
import { Link } from 'react-router-dom'
import { ContractContext } from '../../../context'
import ValidateModal from '../../../walletModule/ValidationModal'
import * as xerraFunction from '../../../redux/actions/xerra'
import * as contract from '../../../contractObject'

const UsdtInvest = () => {
  const { myUsdtBalance,setShowValidate } = React.useContext(ContractContext)
  const xerra = useSelector((state) => state.xerraDataReducer)
  const itemStyle = {
    backgroundColor: '#ebebf0',
    borderRadius: '5px',
    padding: '5px 20px 5px 20px',
    width: '400px',
    textAlign: 'right',
    fontWeight: '700',
  }
  const [curUsdt, setCurUsdt] = React.useState(0)
  const [furUsdt, setFurUsdt] = React.useState(0)
  const [params, setParams] = React.useState(0)
  const [token, setToken] = React.useState('')
  const [seeModal, setSeeModal] = React.useState(false)
  const [estimateGas, setEstimateGas] = React.useState(0)
  const [disable, setDisabled] = React.useState(true)

  const handleCurUsdtChange = (e) => {
    const value = contract.handleDecimel(e.target.value)
    const total = ethers.utils.parseEther(value.toString())
    if (value) {
      setParams(total)
      setCurUsdt(value)
      setFurUsdt(value * 0.1 + value)
      setDisabled(false)
    } else {
      setFurUsdt(0)
      setCurUsdt(0)
      setDisabled(true)
    }
  }

  const handleStake = async () => {

    const gas = await xerraFunction.buyUSDTBondGas(params)
    setEstimateGas(gas)
    setToken('xerraUsdtStake')
    setShowValidate(true)
  }

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
      <Card
        style={{ width: '100vw', height: '200px', backgroundColor: 'green' }}
      >
        <div className="grid grid-rows-3 grid-cols-2 place-content-center">
          <div></div>
          <div></div>
          <div className="grid row-span-2 grid-rows-2 place-content-center ">
            <Typography.Title style={{ color: 'white' }} level={3}>
              USDT Stake
            </Typography.Title>
            <Typography.Text style={{ color: 'white' }}>
              Grow your USDT, stable earning
            </Typography.Text>
          </div>
        </div>
      </Card>
      <div className="flex place-content-center mt-10">
        <Form>
          <Typography.Title level={4}>USDT Pool Overview</Typography.Title>
          <Form.Item style={itemStyle} label="Total USDT in Pool">
            {xerra?.usdt} USDT
          </Form.Item>
          <Typography.Title level={5}>Amount of USDT Stake</Typography.Title>
          <Form.Item>
            <Typography.Text style={{ color: 'gray' }}>
              Available: {myUsdtBalance} USDT
            </Typography.Text>
            <Input
              onChange={handleCurUsdtChange}
              value={curUsdt}
              suffix={
                <div className="grid place-content-center grid-cols-2 h-full w-full">
                  <Avatar src="https://img.icons8.com/color/2x/tether--v2.png" />
                  <p className="grid place-content-center h-full font-bold text-slate-500">
                    USDT
                  </p>
                </div>
              }
            />
          </Form.Item>
          <Typography.Title level={5}>
            Amount of USDT you get 1 year later
          </Typography.Title>
          <Form.Item>
            <Input
              readOnly
              value={furUsdt}
              suffix={
                <div className="grid place-content-center grid-cols-2 h-full w-full">
                  <Avatar src="https://img.icons8.com/color/2x/tether--v2.png" />
                  <p className="grid place-content-center h-full font-bold text-slate-500">
                    USDT
                  </p>
                </div>
              }
            />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ width: '100%', height: '40px', borderRadius: '5px' }}
              type="primary"
              onClick={handleStake}
              disabled={disable}
            >
              Stake
            </Button>
          </Form.Item>
          <ValidateModal
            token={token}
            setParams={setParams}
            params={params}
            setEstimateGas={setEstimateGas}
            estimateGas={estimateGas}
            setSeeModal={setSeeModal}
          />
        </Form>
      </div>
    </div>
  )
}

export default UsdtInvest
