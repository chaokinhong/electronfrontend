import { Button, Card, Form, Image, Typography, Input, Avatar } from 'antd'
import * as reduxfunction from '../../redux/actions/pre'
import ValidateModal from '../../walletModule/ValidationModal'
import { ContractContext } from '../../context'
import React from 'react'
import { ethers } from 'ethers'
import { useSelector } from 'react-redux'

const ElectronMarket = () => {
  const itemStyle = {
    backgroundColor: '#ebebf0',
    borderRadius: '5px',
    padding: '5px 20px 5px 20px',
    width: '100%',
    textAlign: 'right',
    fontWeight: '700',
  }
  const [seeModal, setSeeModal] = React.useState(false)
  const [curEtr, setCurEtr] = React.useState(0)
  const [disabled, setDisabled] = React.useState(true)
  const [params, setParams] = React.useState()
  const [estimateGas, setEstimateGas] = React.useState()
  const { myEtrBalance, setShowValidate } = React.useContext(ContractContext)
  const pre = useSelector((state) => state.preReducer)

  const handleExchange = async (e) => {
    const estimateGas = await reduxfunction.lockElecGas(params)
    setEstimateGas(estimateGas)
    setShowValidate(true)
  }

  const handleCalculate = (e) => {
    const value = Number(e.target.value)
    if (value) {
      const total = ethers.utils.parseEther(value.toString())
      setCurEtr(value)
      setParams(total)
      setDisabled(false)
    } else {
      setCurEtr(0)
      setDisabled(true)
    }
  }
  return (
    <Card
      style={{
        width: '550px',
        borderRadius: '10px',
      }}
    >
      <Typography.Title level={4}>Power Plant Overview</Typography.Title>

      <Form.Item label="Total Electricity Generated" style={itemStyle}>
        {pre.elec} Kwh
      </Form.Item>

      <Form.Item>
        <div className="grid place-content-center">
          <Image
            width={150}
            preview={false}
            src="https://img.icons8.com/cotton/344/car-battery--v1.png"
          />
        </div>
      </Form.Item>
      <Form.Item label="My ETR" style={itemStyle}>
        {myEtrBalance} ETR
      </Form.Item>
      <Typography.Title level={4}>Electricity Generated Exchange</Typography.Title>
      <Typography.Text style={{ color: 'gray' }}>
        1 kwh electricity = 1 ETR
      </Typography.Text>
      <Form>
        <Form.Item
          name="elec"
          rules={[
            {
              required: true,
              message: 'Please input amount of ETR!',
            },
          ]}
        >
          <Input
            onChange={handleCalculate}
            suffix={
              <div className="grid place-content-center grid-cols-2 h-full w-full">
                <Avatar src="https://img.icons8.com/cotton/344/electricity.png" />
                <p className="grid place-content-center h-full font-bold text-slate-500">
                  Kwh
                </p>
              </div>
            }
            value={curEtr}
          />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={disabled}
            type="primary"
            style={{
              backgroundColor: '#c9b308',
              border: '#c9b308',
              borderRadius: '5px',
              width: '100%',
              height: '40px',
            }}
            onClick={handleExchange}
          >
            Confirm
          </Button>
        </Form.Item>
      </Form>
      <ValidateModal
        token={'elec2etr'}
        setParams={setParams}
        params={params}
        setEstimateGas={setEstimateGas}
        estimateGas={estimateGas}
        setSeeModal={setSeeModal}
      />
    </Card>
  )
}

export default ElectronMarket
