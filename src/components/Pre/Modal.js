import React from 'react'
import { Modal, Form, Spin, Input } from 'antd'
import { useNavigate } from 'react-router'
import { ethers } from 'ethers'
import { ContractContext } from '../../context'
import * as reduxAction from '../../redux/actions/pre'
import ValidateModal from '../../walletModule/ValidationModal'
import * as contract from '../../contractObject'

const Modals = ({ setSeeModal, seeModal, token, setMeun }) => {
  const [modalForm] = Form.useForm()
  const navigate = useNavigate()
  const [estimateGas, setEstimateGas] = React.useState()
  const [spinning, setSpinning] = React.useState(false)
  const [params, setParams] = React.useState()
  const { capitalize, showValidate, setShowValidate } = React.useContext(
    ContractContext,
  )

  const handleCancel = () => {
    setSpinning(false)
    setSeeModal(false)
    modalForm.resetFields()
    setMeun(1)
  }

  const onFinish = async (form) => {
    if (token == 'usdt') {
      try {
        const data = parseInt(form.usdt)
        const total = ethers.utils.parseEther(data.toString())
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
        await usdtContract.connect(poolSigner).approve(poolAddress, total)
        setSpinning(true)
        const estimateGas = reduxAction.gweiToInt(
          await poolContract.estimateGas.addTokenLiquidity(total),
        )
        setEstimateGas(estimateGas)
        setParams(total)
        setShowValidate(true)
      } catch (error) {
        console.log(error)
        alert('Do not have enough USDT')
        setSeeModal(false)
        setSpinning(false)
        modalForm.resetFields()
      }
    }
    if (token == 'electricity') {
      setSpinning(true)
      const data = parseInt(form.electricity)
      const total = ethers.utils.parseEther(data.toString())
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
      const estimateGas = reduxAction.gweiToInt(
        await poolContract.estimateGas.electricityToEtr(total),
      )
      setEstimateGas(estimateGas)
      setParams(total)
      setShowValidate(true)
    }
    if (token == 'etr') {
      try {
        setSpinning(true)
        const data = parseInt(form.etr)
        const total = ethers.utils.parseEther(data.toString())
        const [
          poolContract,
          poolSigner,
          poolAddress,
        ] = await contract.poolContractObject()
        await poolContract.connect(poolSigner).approve(poolAddress, total)
        setSpinning(true)
        const estimateGas = reduxAction.gweiToInt(
          await poolContract.estimateGas.addEtrLiquidity(total),
        )
        setEstimateGas(estimateGas)
        setParams(total)
        setShowValidate(true)
      } catch (error) {
        console.log(error)
        alert("Don't have enough ETR, exchange by your electricity please")
        setSeeModal(false)
        setSpinning(false)
        modalForm.resetFields()
      }
    }
  }

  const checkPrice = (_, value) => {
    if (value > 0) {
      return Promise.resolve()
    }

    return Promise.reject(new Error('Price must be greater than zero!'))
  }
  return (
    <Modal
      title={capitalize(token) + '   Stake'}
      visible={seeModal}
      onOk={modalForm.submit}
      onCancel={handleCancel}
    >
      <Spin spinning={spinning}>
        <Form form={modalForm} onFinish={onFinish}>
          <Form.Item
            name={token}
            label={capitalize(token)}
            rules={[
              {
                validator: checkPrice,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Spin>

      <ValidateModal
        token={token}
        setParams={setParams}
        params={params}
        setEstimateGas={setEstimateGas}
        estimateGas={estimateGas}
        setSeeModal={setSeeModal}
      />
    </Modal>
  )
}

export default Modals
