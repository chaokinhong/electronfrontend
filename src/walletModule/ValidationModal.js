import React from 'react'
import { Form, Modal, Typography, Input, Avatar, Spin } from 'antd'
import { ContractContext } from '../context'
import { useNavigate } from 'react-router'
import * as reduxAction from '../redux/actions/pre'
import * as xerraFunction from '../redux/actions/xerra'

const ValidateModal = ({
  params,
  setParams,
  estimateGas,
  setEstimateGas,
  setSeeModal,
  token,
}) => {
  const [validateForm] = Form.useForm()
  const {
    checkNum,
    showValidate,
    setShowValidate,
    validateFundPassword,
  } = React.useContext(ContractContext)

  const [spinning, setSpinning] = React.useState(false)
  const navigate = useNavigate()

  const handleCancel = () => {
    validateForm.resetFields()
    setSeeModal(false)
    setShowValidate(false)
    setParams()
    setEstimateGas()
    navigate(0)
    setSpinning(false)
  }

  const handleValidation = async (form) => {
    const isCorrect = await validateFundPassword(form.fpw)
    switch (token) {
      case 'usdt':
        if (isCorrect) {
          try {
            setSpinning(true)
            await reduxAction.lockUsdt(params, navigate)
          } catch (error) {
            alert('Something went wrong')
          }
          handleCancel()
        } else {
          alert('Wrong Fund Password')
          validateForm.resetFields()
        }
      case 'electricity':
        if (isCorrect) {
          try {
            setSpinning(true)
            await reduxAction.lockElecAndStake(params, navigate)
          } catch (error) {
            alert('Something went wrong')
          }
          handleCancel()
        } else {
          alert('Wrong Fund Password')
          validateForm.resetFields()
        }
      case 'etr':
        if (isCorrect) {
          try {
            setSpinning(true)
            await reduxAction.lockEtr(params, navigate)
          } catch (error) {
            alert('Something went wrong')
          }
          handleCancel()
        } else {
          alert('Wrong Fund Password')
          validateForm.resetFields()
        }
      case 'usdtBuy':
        if (isCorrect) {
          try {
            setSpinning(true)
            await reduxAction.tokenBuy(params)
          } catch (error) {
            alert('Something went wrong')
          }
          handleCancel()
        } else {
          alert('Wrong Fund Password')
          validateForm.resetFields()
        }
      case 'etrBuy':
        if (isCorrect) {
          try {
            setSpinning(true)
            await reduxAction.etrBuy(params)
          } catch (error) {
            alert('Something went wrong')
          }
          handleCancel()
        } else {
          alert('Wrong Fund Password')
          validateForm.resetFields()
        }
      case 'lpAdd':
        if (isCorrect) {
          try {
            setSpinning(true)
            await reduxAction.lockUsdt(params.usdt, navigate)
            await reduxAction.lockEtr(params.etr, navigate)
          } catch (error) {
            alert('Something went wrong')
          }
          handleCancel()
        } else {
          alert('Wrong Fund Password')
          validateForm.resetFields()
        }
      case 'lpRedeem':
        if (isCorrect) {
          setSpinning(true)
          if (params.usdt > 0 && params.etr == 0) {
            try {
              await reduxAction.withdrawUsdt(params.usdt)
            } catch (error) {
              alert('Something went wrong')
            }
            handleCancel()
          } else if (params.etr > 0 && params.usdt == 0) {
            try {
              await reduxAction.withdrawEtr(params.etr)
            } catch (error) {
              alert('Something went wrong')
            }
            handleCancel()
          } else {
            try {
              await reduxAction.withdrawUsdt(params.usdt)
              await reduxAction.withdrawEtr(params.etr)
            } catch (error) {
              alert('Something went wrong')
            }
            handleCancel()
          }
        } else {
          alert('Wrong Fund Password')
          validateForm.resetFields()
        }
      case 'etr2elec':
        if (isCorrect) {
          try {
            setSpinning(true)
            await reduxAction.etr2Electricity(params)
          } catch (error) {
            alert('Something went wrong')
          }
          handleCancel()
        } else {
          alert('Wrong Fund Password')
          validateForm.resetFields()
        }
      case 'elec2etr':
        if (isCorrect) {
          try {
            setSpinning(true)
            await reduxAction.lockElec(params)
          } catch (error) {
            alert('Something went wrong')
          }
          handleCancel()
        } else {
          alert('Wrong Fund Password')
          validateForm.resetFields()
        }
      case 'xerra':
        if (isCorrect) {
          try {
            setSpinning(true)
            await xerraFunction.preBuyXerra(params)
          } catch (error) {
            alert('Something went wrong')
          }
          handleCancel()
        } else {
          alert('Wrong Fund Password')
          validateForm.resetFields()
        }
      case 'xerraBuy':
        if (isCorrect) {
          try {
            setSpinning(true)
            await xerraFunction.buyXerra(params)
          } catch (error) {
            alert('Something went wrong')
          }
          handleCancel()
        } else {
          alert('Wrong Fund Password')
          validateForm.resetFields()
        }
      case 'xerraSell':
        if (isCorrect) {
          try {
            setSpinning(true)
            await xerraFunction.sellXerra(params)
          } catch (error) {
            alert('Something went wrong')
          }
          handleCancel()
        } else {
          alert('Wrong Fund Password')
          validateForm.resetFields()
        }
      case 'xerraUsdtStake':
        if (isCorrect) {
          try {
            setSpinning(true)
            await xerraFunction.buyUSDTBond(params)
          } catch (error) {
            alert('Something went wrong')
          }
          handleCancel()
        } else {
          alert('Wrong Fund Password')
          validateForm.resetFields()
        }
    }
  }

  return (
    <div>
      <Modal
        title="Fund Password validation"
        visible={showValidate}
        onOk={validateForm.submit}
        onCancel={handleCancel}
      >
        <Spin spinning={spinning}>
          <Form.Item>
            <Typography>
              Estimate Gas: {estimateGas}
              <Avatar src="https://img.icons8.com/color/344/ethereum.png" />
            </Typography>
          </Form.Item>

          <Form form={validateForm} onFinish={handleValidation}>
            <Form.Item
              name="fpw"
              label="Fund Password"
              rules={[
                {
                  validator: checkNum,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}

export default ValidateModal
