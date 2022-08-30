import { Button, Card, Form, Modal, Typography, Input, Avatar } from 'antd'
import * as reduxfunction from '../../redux/actions/pre'
import ValidateModal from '../../walletModule/ValidationModal'
import { ContractContext } from '../../context'
import React from 'react'
import { ethers } from 'ethers'

const ElectricityMarket = () => {
  const [seeModal, setSeeModal] = React.useState(false)
  const [curEtr, setCurEtr] = React.useState(0)
  const [disabled, setDisabled] = React.useState(true)
  const [params, setParams] = React.useState()
  const [estimateGas, setEstimateGas] = React.useState()
  const { myEtrBalance, setShowValidate } = React.useContext(ContractContext)

  const handleExchange = async (e) => {
    const estimateGas = await reduxfunction.etr2ElectricityGas(params)
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
      <Typography.Title level={3}>Electricity Market</Typography.Title>
      <Typography.Text style={{ color: 'gray' }}>
        1 ETR = 1 kwh electricity
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
                <Avatar src="https://img.icons8.com/external-creatype-flat-colourcreatype/344/external-electron-science-education-flat-creatype-flat-colourcreatype.png" />
                <p className="grid place-content-center h-full font-bold text-slate-500">
                  ETR
                </p>
              </div>
            }
            value={curEtr}
          />
          <Typography.Text style={{ color: 'gray' }}>
            Available: <label style={{ color: 'black' }}>{myEtrBalance}</label>
            <label> ETR</label>
          </Typography.Text>
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
        token={'etr2elec'}
        setParams={setParams}
        params={params}
        setEstimateGas={setEstimateGas}
        estimateGas={estimateGas}
        setSeeModal={setSeeModal}
      />
    </Card>
  )
}

export default ElectricityMarket
