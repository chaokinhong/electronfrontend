import React from 'react'
import {
  Modal,
  Form,
  Typography,
  Slider,
  Card,
  Avatar,
  Button,
  Spin,
} from 'antd'
import { useSelector } from 'react-redux'
import * as contract from '../../../contractObject'
import * as reduxAction from '../../../redux/actions/pre'
import { ethers } from 'ethers'
import ValidateModal from '../../../walletModule/ValidationModal'
import { ContractContext } from '../../../context'

const RedeemModal = (props) => {
  const [form] = Form.useForm()
  const pre = useSelector((state) => state.preReducer)
  const reward = useSelector((state) => state.rewardReducer)
  const marks = {
    0: '0%',
    100: '100%',
  }
  const { setShowValidate } = React.useContext(ContractContext)
  const [disabled, setDisabled] = React.useState(true)
  const [params, setParams] = React.useState()
  const [estimateGas, setEstimateGas] = React.useState()
  const [spinning, setSpinning] = React.useState(false)
  const [curEtr, setCurEtr] = React.useState(0)
  const [curUsdt, setCurUsdt] = React.useState(0)
  const handleChange = (value) => {
    if (value > 0) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
    const usdt = (reward.myTokenStake * value - 0.01) / 100
    const etr = (reward.myEtrStake * value - 0.01) / 100
    setCurEtr(etr)
    setCurUsdt(usdt)
  }

  const handleSubmit = async () => {
    const usdt = contract.handleDecimel(curUsdt)
    const etr = contract.handleDecimel(curEtr)
    console.log(usdt)
    console.log(etr)
    try {
      if (usdt > 0 && etr == 0) {
        const usdtTotal = ethers.utils.parseEther(usdt.toString())
        setSpinning(true)
        const estimateUsdtGas = await reduxAction.withdrawUsdtEstimateGas(
          usdtTotal,
        )
        setParams({ usdt: usdtTotal, etr: 0 })
        setEstimateGas(parseFloat(estimateUsdtGas).toFixed(10))
        setShowValidate(true)
      } else if (etr > 0 && usdt == 0) {
        const etrTotal = ethers.utils.parseEther(etr.toString())
        setSpinning(true)
        const estimateEtrGas = await reduxAction.withdrawEtrEstimateGas(
          etrTotal,
        )
        setParams({ usdt: 0, etr: etrTotal })
        setEstimateGas(parseFloat(estimateEtrGas).toFixed(10))
        setShowValidate(true)
      } else {
        const usdtTotal = ethers.utils.parseEther(usdt.toString())
        const etrTotal = ethers.utils.parseEther(etr.toString())
        setSpinning(true)
        const estimateUsdtGas = await reduxAction.withdrawUsdtEstimateGas(
          usdtTotal,
        )
        const estimateEtrGas = await reduxAction.withdrawEtrEstimateGas(
          etrTotal,
        )
        const estimateGas = Number(estimateEtrGas) + Number(estimateUsdtGas)
        setParams({ usdt: usdtTotal, etr: etrTotal })
        setEstimateGas(parseFloat(estimateGas).toFixed(10))
        setShowValidate(true)
      }
    } catch (error) {
      console.log(error)
      alert('Something went wrong')
      setSpinning(false)
    }
  }

  return (
    <Modal
      visible={props.showRedeem}
      title="Redeem"
      footer={null}
      onCancel={() => props.setShowRedeem(false)}
    >
      <Spin spinning={spinning}>
        <Form form={form}>
          <Form.Item
            style={{ backgroundColor: '#f0f0f5', borderRadius: '10px' }}
          >
            <div className="grid grid-rows-2 grid-cols-2 rounded-md place-content-between m-3 ">
              <p className="font-bold text-slate-500">My Liquidity</p>
              <p className="text-end font-semibold">
                {parseFloat(
                  Math.sqrt(reward.myTokenStake * reward.myEtrStake),
                ).toFixed(6)}{' '}
                USDT
              </p>
              <p className="font-bold text-slate-500">Ratio</p>
              <p className="text-end font-semibold">
                {parseFloat(
                  (Math.sqrt(reward.myTokenStake * reward.myEtrStake) * 100) /
                    Math.sqrt(pre.usdt * pre.etr),
                ).toFixed(2)}
                %
              </p>
            </div>
          </Form.Item>
          <Typography.Title level={5}>Redeem Liquidity</Typography.Title>
          <Form.Item>
            <Slider marks={marks} onChange={handleChange} />
          </Form.Item>
          <Typography.Title level={5}>Estimated redeemable</Typography.Title>
          <Form.Item>
            <div className="grid grid-cols-2 place-content-center gap-3">
              <Card
                style={{ height: '70%' }}
                className="grid place-content-center"
                bordered
              >
                <div className="grid grid-cols-5 gap-6 place-content-center">
                  <Avatar
                    className="col-span-1"
                    src="https://img.icons8.com/color/2x/tether--v2.png"
                    size={30}
                    shape="circle"
                  />
                  <p className="col-span-4 mt-1 font-semibold">
                    {parseFloat(curUsdt).toFixed(5)} USDT
                  </p>
                </div>
              </Card>
              <Card
                style={{ height: '70%' }}
                className="grid place-content-center"
                bordered
              >
                <div className="grid grid-cols-5 gap-6 place-content-center">
                  <Avatar
                    className="col-span-1"
                    src="https://img.icons8.com/external-creatype-flat-colourcreatype/344/external-electron-science-education-flat-creatype-flat-colourcreatype.png"
                    size={30}
                    shape="circle"
                  />
                  <p className="col-span-4 mt-1 font-semibold">
                    {parseFloat(curEtr).toFixed(5)} ETR
                  </p>
                </div>
              </Card>
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              style={{ width: '100%', height: '40px', borderRadius: '10px' }}
              type="primary"
              onClick={handleSubmit}
              disabled={disabled}
            >
              Redeem
            </Button>
          </Form.Item>
        </Form>
        <ValidateModal
          token={'lpRedeem'}
          setParams={setParams}
          params={params}
          setEstimateGas={setEstimateGas}
          estimateGas={estimateGas}
          setSeeModal={props.setShowRedeem}
        />
      </Spin>
    </Modal>
  )
}

export default RedeemModal
