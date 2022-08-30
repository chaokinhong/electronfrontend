import React from 'react'
import {
  Card,
  Form,
  Input,
  Avatar,
  Image,
  InputNumber,
  Checkbox,
  Button,
  Typography,
} from 'antd'
import * as contract from '../../contractObject'
import { ethers } from 'ethers'
import { ContractContext } from '../../context'
import { useNavigate } from 'react-router'
import ValidateModal from '../../walletModule/ValidationModal'
import * as contractFunction from '../../redux/actions/pre'
import { ifError } from 'assert'

const Buy = () => {
  const {
    ethersToInt,
    setShowValidate,
    myEtrBalance,
    myUsdtBalance,
  } = React.useContext(ContractContext)
  const [isUsdt, setIsUsdt] = React.useState(true)
  const [curUsdt, setCurUsdt] = React.useState(0)
  const [curEtr, setCurEtr] = React.useState(0)
  const [params, setParams] = React.useState(0)
  const [token, setToken] = React.useState('')
  const [disabled, setDisabled] = React.useState(true)
  const [seeModal, setSeeModal] = React.useState(false)
  const [estimateGas, setEstimateGas] = React.useState(0)

  const navigate = useNavigate()

  const handleUsdtCalculate = async (e) => {
    const value = contract.handleDecimel(e.target.value)
    console.log(value)
    if (value) {
      const [
        poolContract,
        poolSigner,
        poolAddress,
      ] = await contract.poolContractObject()

      const total = ethers.utils.parseEther(value.toString())
      const price = await poolContract.getEtrAmount(total)
      const readablePrice = ethersToInt(price)
      setCurUsdt(value)
      setCurEtr(readablePrice)
      setParams(total)
      setDisabled(false)
    } else {
      setCurEtr(0)
      setCurUsdt(0)
      setDisabled(true)
    }
  }

  const handleEtrCalculate = async (e) => {
    const value = contract.handleDecimel(e.target.value)
    console.log(value)
    if (value) {
      const [
        poolContract,
        poolSigner,
        poolAddress,
      ] = await contract.poolContractObject()
      const total = ethers.utils.parseEther(value.toString())
      const price = await poolContract.getTokenAmount(total)
      const readablePrice = ethersToInt(price)
      setCurEtr(value)
      setCurUsdt(readablePrice)
      setParams(total)
      setDisabled(false)
    } else {
      setCurEtr(0)
      setCurUsdt(0)
      setDisabled(true)
    }
  }

  const handleUsdtBuy = async () => {
    const gas = await contractFunction.tokenBuyGas(params)
    setEstimateGas(gas)
    setToken('usdtBuy')
    setShowValidate(true)
  }

  const handleEtrBuy = async () => {
    const gas = await contractFunction.etrBuyGas(params)
    setEstimateGas(gas)
    setToken('etrBuy')
    setShowValidate(true)
  }

  return (
    <Card style={{ width: '550px', borderRadius: '10px' }}>
      <Form>
        <Typography.Title level={3}>Crypto Market</Typography.Title>
        <Typography.Text>From</Typography.Text>
        <Form.Item>
          {isUsdt ? (
            <Input
              onChange={handleUsdtCalculate}
              suffix={
                <div className="grid place-content-center grid-cols-2 h-full w-full">
                  <Avatar src="https://img.icons8.com/color/2x/tether--v2.png" />
                  <p className="grid place-content-center h-full font-bold text-slate-500">
                    USDT
                  </p>
                </div>
              }
              style={{
                color: 'black',
              }}
              value={parseFloat(curUsdt)}
            />
          ) : (
            <Input
              onChange={handleEtrCalculate}
              suffix={
                <div className="grid place-content-center grid-cols-2 h-full w-full">
                  <Avatar src="https://img.icons8.com/external-creatype-flat-colourcreatype/344/external-electron-science-education-flat-creatype-flat-colourcreatype.png" />
                  <p className="grid place-content-center h-full font-bold text-slate-500">
                    ETR
                  </p>
                </div>
              }
              style={{
                color: 'black',
              }}
              value={parseFloat(curEtr)}
            />
          )}
          <div
            className="grid  border-r-2 border-gray-200"
            style={{ width: '485px' }}
          >
            <Typography.Text style={{ color: 'gray' }}>
              Available{' '}
              {isUsdt ? (
                <label>
                  <label style={{ color: 'black' }}>
                    {parseFloat(myUsdtBalance).toFixed(5)}
                  </label>
                  <label> USDT</label>
                </label>
              ) : (
                <label>
                  <label style={{ color: 'black' }}>
                    {parseFloat(myEtrBalance).toFixed(5)}
                  </label>
                  <label> ETR</label>
                </label>
              )}
            </Typography.Text>
          </div>
        </Form.Item>

        <Form.Item>
          <div
            className="grid place-content-end  "
            onClick={() => setIsUsdt(!isUsdt)}
          >
            <button className=" border-gray-200 rounded-full border-2 grid place-content-center p-1 ">
              <Image
                width={20}
                preview={false}
                src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/344/external-swap-arrows-tanah-basah-basic-outline-tanah-basah-2.png"
              />
            </button>
          </div>
        </Form.Item>
        <div
          className="grid  border-r-2 border-gray-200"
          style={{ width: '485px' }}
        >
          <Typography.Text>To</Typography.Text>
        </div>
        <Form.Item>
          {!isUsdt ? (
            <Input
              onChange={handleUsdtCalculate}
              suffix={
                <div className="grid place-content-center grid-cols-2 h-full w-full">
                  <Avatar src="https://img.icons8.com/color/2x/tether--v2.png" />
                  <p className="grid place-content-center h-full font-bold text-slate-500">
                    USDT
                  </p>
                </div>
              }
              style={{
                color: 'black',
              }}
              value={parseFloat(curUsdt)}
            />
          ) : (
            <Input
              onChange={handleEtrCalculate}
              suffix={
                <div className="grid place-content-center grid-cols-2 h-full w-full">
                  <Avatar src="https://img.icons8.com/external-creatype-flat-colourcreatype/344/external-electron-science-education-flat-creatype-flat-colourcreatype.png" />
                  <p className="grid place-content-center h-full font-bold text-slate-500">
                    ETR
                  </p>
                </div>
              }
              style={{
                color: 'black',
              }}
              value={parseFloat(curEtr)}
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            onClick={isUsdt ? handleUsdtBuy : handleEtrBuy}
            style={{ width: '100%', height: '40px', borderRadius: '5px' }}
            disabled={disabled}
            type="primary"
          >
            Confirm
          </Button>
        </Form.Item>
      </Form>
      <ValidateModal
        token={token}
        setParams={setParams}
        params={params}
        setEstimateGas={setEstimateGas}
        estimateGas={estimateGas}
        setSeeModal={setSeeModal}
      />
    </Card>
  )
}

export default Buy
