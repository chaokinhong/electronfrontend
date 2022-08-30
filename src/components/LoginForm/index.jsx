import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Card, Typography, Row, Col } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { signin } from '../../redux/actions/auth'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './index.css'

const LoginForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onFinish = (values) => {
    dispatch(signin(values, navigate))
  }

  return (
    <div className="grid place-content-center p-40">
      <Card style={{ width: 300 }}>
        <div className="grid place-content-center">
          <Typography.Title underline={true}>Log in</Typography.Title>
        </div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
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
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            or <Link to="/signup">Sign up now!</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default LoginForm
