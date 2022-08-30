import React from 'react'
import { Form, Modal, Input, Avatar, Button, Spin } from 'antd'
import { ContractContext } from '../../../context'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import * as contract from '../../../contractObject'
import * as reduxAction from '../../../redux/actions/pre'
import ValidateModal from '../../../walletModule/ValidationModal'

const AddModal = (props) => {
  const { myEtrBalance, myUsdtBalance, setShowValidate } = React.useContext(
    ContractContext,
  )
  const [addForm] = Form.useForm()
  const [disabled,setDisabled] = React.useState(false)
  const pre = useSelector((state) => state.preReducer)
  const [params, setParams] = React.useState()
  const [estimateGas, setEstimateGas] = React.useState()
  const [spinning, setSpinning] = React.useState(false)
  const [curUsdt, setCurUsdt] = React.useState(myUsdtBalance)
  const [curEtr, setCurEtr] = React.useState(myEtrBalance)

  const handleUsdtChange = (e) => {
    const value = Number(e.target.value)
    if (value) {
      setCurUsdt(value)
      setCurEtr((value * pre.etr) / pre.usdt)
      setDisabled(false)
    } else {
      setCurEtr(0)
      setCurUsdt(0)
      setDisabled(true)
    }
  }

  const handleEtrChange = (e) => {
    const value = Number(e.target.value)
    if (value) {
      setCurEtr(value)
      setCurUsdt((value * pre.usdt) / pre.etr)
      setDisabled(false)
    } else {
      setCurEtr(0)
      setCurUsdt(0)
      setDisabled(true)
    }
  }

  const handleSubmit = async () => {
    try {
      const usdt = contract.handleDecimel(curUsdt)
      const etr = contract.handleDecimel(curEtr)
      const usdtTotal = ethers.utils.parseEther(usdt.toString())
      const etrTotal = ethers.utils.parseEther(etr.toString())
      const [
        poolContract,
        poolSigner,
        poolAddress,
      ] = await contract.poolContractObject()
      const [
        usdtContract,
        usdtSigner,
        usdtAddress,
      ] = await contract.usdtContractObject()
      await usdtContract.connect(poolSigner).approve(poolAddress, usdtTotal)
      await poolContract.connect(poolSigner).approve(poolAddress, etrTotal)
      setSpinning(true)
      const estimateUsdtGas = reduxAction.gweiToInt(
        await poolContract.estimateGas.addTokenLiquidity(usdtTotal),
      )
      const estimateEtrGas = reduxAction.gweiToInt(
        await poolContract.estimateGas.addEtrLiquidity(etrTotal),
      )
      const estimateGas = Number(estimateEtrGas) + Number(estimateUsdtGas)
      setParams({ usdt: usdtTotal, etr: etrTotal })
      setEstimateGas(parseFloat(estimateGas).toFixed(10))
      setShowValidate(true)
    } catch (error) {
      console.log(error)
      alert('Something went wrong')
      setSpinning(false)
    }
  }

  return (
    <Modal
      visible={props.showAdd}
      title="Add Liquidity"
      footer={null}
      onCancel={() => props.setShowAdd(false)}
    >
      <Spin spinning={spinning}>
        <Form form={addForm}>
          <div className="grid grid-cols-2 place-content-between w-full">
            <p>Size</p>
            <p className="text-end">Available: {myUsdtBalance} </p>
          </div>
          <Form.Item>
            <Input
              onChange={handleUsdtChange}
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
          </Form.Item>
          <div className="grid grid-cols-2 place-content-between w-full">
            <p>Size</p>
            <p className="text-end">Available: {myEtrBalance} </p>
          </div>
          <Form.Item>
            <Input
              onChange={handleEtrChange}
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
          </Form.Item>
          <Form.Item
            style={{ backgroundColor: '#f0f0f5', borderRadius: '10px' }}
          >
            <div className="grid grid-rows-3 grid-cols-2 rounded-md place-content-between m-3 ">
              <p className="font-bold text-slate-500">USDT/ETR</p>
              <p className="text-end font-semibold">{pre.usdt / pre.etr}</p>
              <p className="font-bold text-slate-500">ETR/USDT</p>
              <p className="text-end font-semibold">{pre.etr / pre.usdt}</p>
              <p className="font-bold text-slate-500">Ratio</p>
              <p className="text-end font-semibold">
                {parseFloat(
                  (Math.sqrt(curEtr * curUsdt) * 100) /
                    Math.sqrt(pre.usdt * pre.etr),
                ).toFixed(2)}{' '}
                %
              </p>
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              style={{ width: '100%', height: '40px', borderRadius: '10px' }}
              type="primary"
              onClick={handleSubmit}
              disabled={disabled}
            >
              Add
            </Button>
          </Form.Item>
        </Form>
        <ValidateModal
          token={'lpAdd'}
          setParams={setParams}
          params={params}
          setEstimateGas={setEstimateGas}
          estimateGas={estimateGas}
          setSeeModal={props.setShowAdd}
        />
      </Spin>
    </Modal>
  )
}

export default AddModal
