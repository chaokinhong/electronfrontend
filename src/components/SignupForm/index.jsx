import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Card, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signup } from '../../redux/actions/auth'
import * as walletModule from '../../walletModule/wallet'
import { ContractContext } from '../../context'
import bcrypt from 'bcryptjs'
import './index.css'

const SignupForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { checkNum } = React.useContext(ContractContext)

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      alert("Password don't match")
    } else {
      const hashedFundPW = await bcrypt.hash(values.fundPassword, 12)
      const newWallet = walletModule.createWallet()
      const encryptedWallet = walletModule.encryptWallet(
        newWallet,
        hashedFundPW,
      )
      const val = {
        confirmPassword: values.confirmPassword,
        email: values.email,
        firstName: values.firstName,
        fundPassword: hashedFundPW,
        lastName: values.lastName,
        password: values.password,
        wallet: encryptedWallet,
      }
      dispatch(signup(val, navigate))
      
    }
  }

  return (
    <div className="grid place-content-center p-40">
      <Card style={{ width: 300 }}>
        <div className="grid place-content-center">
          <Typography.Title underline={true}>Sign up</Typography.Title>
        </div>
        <Form
          name="signup"
          className="signup-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <div className="grid grid-cols-2 gap-2">
            <Form.Item
              name="firstName"
              rules={[
                {
                  required: true,
                  message: 'Please input your First Name!',
                },
              ]}
            >
              <Input placeholder="First Name" />
            </Form.Item>

            <Form.Item
              name="lastName"
              rules={[
                {
                  required: true,
                  message: 'Please input your Last Name!',
                },
              ]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </div>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your Email!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
              {
                min: 8,
                message: 'Password length must larger then 8!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: 'Please input your Password again!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item
            name="fundPassword"
            rules={[
              {
                validator: checkNum,
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Fund Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="signup-form-button"
            >
              Sign up
            </Button>
            Or <Link to="/login">Log in now!</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default SignupForm
