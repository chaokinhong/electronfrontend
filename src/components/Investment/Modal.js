import React from 'react'
import { Modal, Form, Input, Avatar,Spin} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { ContractContext } from '../../context'
import * as reduxAction from '../../redux/actions/pre'

const Modals = ({ setSeeModal, seeModal, token }) => {
  const [modalForm] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [spinning, setSpinning] = React.useState(false)
  const { capitalize } = React.useContext(ContractContext)

  const handleCancel = () => {
    setSeeModal(false)
    modalForm.resetFields()
  }

  const onFinish = async (form) => {
    if (token == 'usdtstake') {
      setSpinning(true)
      await reduxAction.stakeUsdt(form.usdtstake, navigate)
      setSpinning(false)
      modalForm.resetFields()
      setSeeModal(false)
      navigate(0)
    }
    if (token == 'usdtwithdraw') {
      setSpinning(true)
      await reduxAction.withdrawUsdt(form.usdtwithdraw, navigate)
      setSpinning(false)
      modalForm.resetFields()
      setSeeModal(false)
      navigate(0)
    }
    if (token == 'etrstake') {
      setSpinning(true)
      await reduxAction.stakeEtr(form.etrstake, navigate)
      setSpinning(false)
      modalForm.resetFields()
      setSeeModal(false)
      navigate(0)
    }

    if (token == 'etrwithdraw') {
      setSpinning(true)
      await reduxAction.withdrawEtr(form.etrwithdraw, navigate)
      setSpinning(false)
      modalForm.resetFields()
      setSeeModal(false)
      navigate(0)
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
      title={capitalize(token) + ' Modal'}
      visible={seeModal}
      onOk={modalForm.submit}
      onCancel={handleCancel}
    >
      <Spin spinning={spinning}>
        <Form form={modalForm} onFinish={onFinish}>
          <Form.Item
            name={token}
            rules={[
              {
                validator: checkPrice,
              },
            ]}
          >
            {token == 'usdtwithdraw' || token == 'usdtstake' ? (
              <Input
                prefix={
                  <Avatar src="https://img.icons8.com/color/2x/tether--v2.png" />
                }
                style={{ textAlign: 'center', textAlignLast: 'center' }}
                placeholder="amount of USDT"
              />
            ) : (
              <Input
                prefix={
                  <Avatar src="https://img.icons8.com/external-creatype-flat-colourcreatype/344/external-electron-science-education-flat-creatype-flat-colourcreatype.png" />
                }
                style={{ textAlign: 'center', textAlignLast: 'center' }}
                placeholder="amount of ETR"
              />
            )}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}

export default Modals
