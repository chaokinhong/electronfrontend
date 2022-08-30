import React from 'react'
import {
  Progress,
  Typography,
  Menu,
  Card,
  Timeline,
  Button,
  Image,
  Spin,
} from 'antd'
import { MailOutlined, AppstoreOutlined } from '@ant-design/icons'
import WalletConnect from '../ConnectWallet'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Modals from './Modal'
import XerraModal from './XerraModal'
import * as xerraFunctionm from '../../redux/actions/xerra'

const Pre = () => {
  const [curPage, setCurPage] = React.useState(1)
  const [seeModal, setSeeModal] = React.useState(false)
  const [token, setToken] = React.useState('')
  const [percent, setPercent] = React.useState({
    usdt: 0,
    etr: 0,
    elec: 0,
    xerra: 0,
  })
  const [xerraPrice, setXerraPrice] = React.useState()
  const [spinning, setSpinning] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const [target, setTarget] = React.useState({ usdt: 0, etr: 0, xerra: 0 })

  const handlePage = (e) => {
    setCurPage(e.key)
  }
  const pre = useSelector((state) => state.preReducer)
  const key = useSelector((state) => state.keyReducer)
  const xerra = useSelector((state) => state.xerraDataReducer)
  console.log(xerra)

  const handleUsdt = () => {
    setSeeModal(true)
    setToken('usdt')
  }

  const handleEtr = () => {
    setSeeModal(true)
    setToken('electricity')
  }

  const handleXerra = () => {
    setIsVisible(true)
  }

  const init = async () => {
    const usdt = pre?.usdt
    const etr = pre?.etr
    const elec = pre?.elec
    const xerraUsdt = xerra?.usdt
    const targetUsdt = 1000000
    const targetEtr = 3700000
    const targetXerra = 1000000
    const price = await xerraFunctionm.getPreXerraPrice()
    setPercent({
      usdt: twoDp((usdt * 100) / targetUsdt),
      etr: twoDp((etr * 100) / targetEtr),
      elec: elec,
      xerra: twoDp((xerraUsdt * 100) / targetXerra),
    })

    
    if (
      twoDp((usdt * 100) / targetUsdt) >= 100.0 &&
      twoDp((etr * 100) / targetEtr) >= 100.0
    ) {
      setSpinning(true)
    }
    setTarget({ usdt: targetUsdt, etr: targetEtr, xerra: targetXerra })
    setXerraPrice(price)
  }

  const twoDp = (int) => {
    return parseFloat(int).toFixed(2)
  }

  React.useEffect(() => {
    init()
  }, [pre, xerra])

  return (
    <div>
      <Menu mode="horizontal" onClick={handlePage}>
        <Menu.Item key={4} icon={<AppstoreOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key={1} icon={<MailOutlined />}>
          Pool
        </Menu.Item>
        <Menu.Item key={3} icon={<AppstoreOutlined />}>
          My Wallet
        </Menu.Item>
      </Menu>

      <Card
        style={{
          width: '100vw',
          height: '200px',
          backgroundColor: '#30042a',
        }}
      >
        <div className="grid grid-rows-3 grid-cols-2 place-content-center">
          <div></div>
          <div></div>
          <div className="grid row-span-2 grid-rows-2 place-content-center ">
            <Typography.Title style={{ color: 'white' }} level={3}>
              Start Up is Coming!
            </Typography.Title>
            <Typography.Text style={{ color: 'white' }}>
              Become part of Xerra Electron community, invest in Xerra Electron
            </Typography.Text>
          </div>
        </div>
      </Card>

      <div className="grid place-content-center -translate-y-9 w-screen">
        {curPage == 1 && (
          <div className="grid grid-cols-3 gap-6">
            <Card
              style={{
                width: '352px',
                height: '400px',
                background: 'white',
                borderRadius: '10px',
              }}
            >
              {/* <Spin spinning={spinning} tip="Pool build successful"> */}
              <div className="grid place-content-center">
                <Typography.Title
                  level={3}
                  style={{
                    backgroundColor: '#ececec',
                    height: '100%',
                    width: '300px',
                    placeContent: 'center',
                    display: 'grid',
                    borderRadius: '10px',
                  }}
                >
                  USDT pre stake
                </Typography.Title>
                <div className="grid place-content-center mt-10">
                  <Typography.Text style={{ font: 'message-box' }} strong>
                    Target: {target.usdt} USDT
                  </Typography.Text>
                </div>
                <div className="grid  place-content-center mt-4">
                  <Progress
                    type="circle"
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    percent={percent?.usdt}
                  />
                </div>
              </div>
              <Progress
                strokeColor={{
                  from: '#108ee9',
                  to: '#87d068',
                }}
                style={{ marginTop: '14px' }}
                percent={percent?.usdt}
                status="active"
              />

              <div className="grid mt-5">
                <Button
                  onClick={handleUsdt}
                  type="primary"
                  style={{ width: '100%', height: '40px', borderRadius: '5px' }}
                >
                  Confirm
                </Button>
              </div>
              {/* </Spin> */}
            </Card>
            <Card
              style={{
                width: '352px',
                height: '400px',
                background: 'white',
                borderRadius: '10px',
              }}
            >
              {/* <Spin spinning={spinning} tip="Pool build successful"> */}
              <div className="grid  place-content-center">
                <Typography.Title
                  level={3}
                  style={{
                    backgroundColor: '#ececec',
                    height: '100%',
                    width: '300px',
                    placeContent: 'center',
                    display: 'grid',
                    borderRadius: '10px',
                  }}
                >
                  Electricity per kwh pre lock
                </Typography.Title>
                <div className="grid place-content-center mt-10">
                  <Typography.Text style={{ font: 'message-box' }} strong>
                    Target: {target.etr} kwh of electricity
                  </Typography.Text>
                </div>
                <div className="grid  place-content-center mt-4">
                  <Progress
                    type="circle"
                    strokeColor={{
                      '0%': '#f312ff',
                      '100%': '#dfff12',
                    }}
                    percent={percent?.etr}
                  />
                </div>
              </div>
              <Progress
                style={{ marginTop: '14px' }}
                strokeColor={{
                  from: '#f312ff',
                  to: '#dfff12',
                }}
                percent={percent?.etr}
                status="active"
              />

              <div className="grid mt-5 ">
                <Button
                  onClick={handleEtr}
                  type="primary"
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '5px',
                    backgroundColor: '#737508',
                    border: 'none',
                  }}
                >
                  Lock
                </Button>
              </div>
              {/* </Spin> */}
            </Card>
            <Card
              style={{
                width: '352px',
                height: '400px',
                background: 'white',
                borderRadius: '10px',
              }}
            >
              {/* <Spin spinning={spinning} tip="Pool build successful"> */}
              <div className="grid  place-content-center ">
                <Typography.Title
                  level={3}
                  style={{
                    backgroundColor: '#ececec',
                    height: '100%',
                    width: '300px',
                    placeContent: 'center',
                    display: 'grid',
                    borderRadius: '10px',
                  }}
                >
                  Xerra Crypto pre sell
                </Typography.Title>
                <div className="grid place-content-center mt-10">
                  <Typography.Text style={{ font: 'message-box' }} strong>
                    Price: {xerraPrice} USDT/XRA 
                  </Typography.Text>
                </div>
                <div className="grid  place-content-center mt-4">
                  <Progress
                    type="circle"
                    strokeColor={{
                      '0%': '#f312ff',
                      '100%': '#dfff12',
                    }}
                    percent={percent.xerra}
                  />
                </div>
              </div>
              <Progress
                style={{ marginTop: '14px' }}
                strokeColor={{
                  from: '#f312ff',
                  to: '#dfff12',
                }}
                percent={percent.xerra}
                status="active"
              />

              <div className="grid mt-5">
                <Button
                  onClick={handleXerra}
                  type="primary"
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '5px',
                    backgroundColor: 'purple',
                    border: 'none',
                  }}
                >
                  Buy Xerra
                </Button>
              </div>
              {/* </Spin> */}
            </Card>
          </div>
        )}

        {curPage == 3 && <WalletConnect />}
        <Modals
          setSeeModal={setSeeModal}
          seeModal={seeModal}
          token={token}
          setMeun={setCurPage}
        />
      </div>
      <XerraModal isVisible={isVisible} setIsVisible={setIsVisible} />
    </div>
  )
}

export default Pre
