import React from 'react';
import { Button, Badge, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import { isImg } from './utils';
import { Link } from 'react-router-dom';
import { ContractContext } from '../context';

class Banner extends React.PureComponent {
  render() {

    const { ...currentProps } = this.props;
    const { dataSource } = currentProps;
    delete currentProps.dataSource;
    delete currentProps.isMobile;
    const isLogin = window.localStorage.getItem('profile')


    return (
      <div {...currentProps} {...dataSource.wrapper}>
        <QueueAnim
          key="QueueAnim"
          type={['bottom', 'top']}
          delay={200}
          {...dataSource.textWrapper}
        >
          <div key="title" {...dataSource.title} style={{ paddingRight: "70px" }}>
            {typeof dataSource.title.children === 'string' &&
              dataSource.title.children.match(isImg) ? (
              <img src={dataSource.title.children} width="100%" alt="img" />
            ) : (
              dataSource.title.children
            )}
          </div>
          <div key="content" {...dataSource.content}>
            {dataSource.content.children}
          </div>
          <div>
            {isLogin ?
              <div >
                <Badge style={{ color: 'white', marginRight: '15px' }} status="success" text='Online' />
                <Button ghost key="button" onClick={() => {
                  window.localStorage.removeItem('profile'); window.location
                    .reload()
                }} >
                  {dataSource.button1.children}
                </Button>
              </div>
              :
              <div>
                <Badge style={{ color: 'white', marginRight: '15px' }} status="error" text='Offline' />
                <div className='pt-6'>
                  <Button style={{width:'100px'}} ghost key="button" {...dataSource.button} >
                    <Link to='/login'>{dataSource.button.children}</Link>
                  </Button>
                </div>
              </div>
            }
            {/* <div>
              <Typography.Title style={{color:'white'}} underline={true}>Pre sale is coming! Become the provider of the network</Typography.Title>
              <Button ghost style={{marginTop:'20px'}} key="button" {...dataSource.button} >
                    <Link to='/pre'>{dataSource.button2.children}</Link>
                  </Button>
            </div> */}
          </div>

        </QueueAnim>
        <TweenOne
          animation={{
            y: '-=20',
            yoyo: true,
            repeat: -1,
            duration: 1000,
          }}
          className="banner0-icon"
          key="icon"
        >
          <DownOutlined />
        </TweenOne>
      </div>
    );
  }
}
export default Banner;
