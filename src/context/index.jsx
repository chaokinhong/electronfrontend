import React from 'react'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getData, rewardData, getKey } from '../redux/actions/pre'
import * as xerraFunction from '../redux/actions/xerra'
import * as reduxFuntion from '../redux/actions/pre'
import * as contract from '../contractObject'
import { useSelector } from 'react-redux'
import * as walletModule from '../walletModule/wallet'
import bcrypt from 'bcryptjs'

export const ContractContext = React.createContext()

export const ContractProvider = ({ children }) => {
  /* -------------------------properties---------------------------------------------------------- */
  const [provider, setProvider] = React.useState()
  const navigate = useNavigate()
  const [account, setAccount] = React.useState()
  const [network, setNetwork] = React.useState()
  const [myUsdtBalance, setMyUsdtBalance] = React.useState(0)
  const [myEtrBalance, setMyEtrBalance] = React.useState(0)
  const [myXerraBalance, setMyXerraBalance] = React.useState(0)
  const [ownerEthWallet, setOwnerEthWallet] = React.useState()
  const [spinning, setSpinning] = React.useState(true)
  const pre = useSelector((state) => state.preReducer)
  const key = useSelector((state) => state.keyReducer)
  const [id, setId] = React.useState()
  const [showValidate, setShowValidate] = React.useState(false)
  const [correct, setCorrect] = React.useState(false)
  const balancerRef = React.useRef()
  const firstRenderRef = React.useRef(0)
  const balanceExec = React.useRef(0)
  const dispatch = useDispatch()

  /* -------------------------functions---------------------------------------------------------- */

  const infuraId =
    'https://rinkeby.infura.io/v3/44096091314c4325854f2bfdbac703da'

  const shortenAddress = (address) => {
    if (address)
      return `${address?.slice(0, 5)}...${address?.slice(address.length - 4)}`
  }

  const ethersToInt = (num) => parseFloat(num / 1000000000000000000).toFixed(2)

  const checkNum = (_, value) => {
    if (value > 0 && value.toString().length == 6) {
      return Promise.resolve()
    }

    return Promise.reject(
      new Error('Please input your fund password with six numbers'),
    )
  }
  /*-------------------------wallet connect function------------------------------------------------------ */

  const toHex = (num) => {
    const hexnum = ethers.utils.hexValue(num)
    return hexnum
  }

  const twoDp = (int) => {
    return parseFloat(int).toFixed(2)
  }

  const connectWallet = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        walletModule.providerURL,
      )
      const network = await provider.getNetwork()
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
      const [
        xerraContract,
        xerraSigner,
        xerraAddress,
      ] = await contract.xerraContractObject()
      const etrrr = await poolContract.balanceOf(poolSigner.address)
      const usdttt = await usdtContract.balanceOf(poolSigner.address)
      const xerraa = await xerraContract.balanceOf(poolSigner.address)
      const etr = ethersToInt(Number(etrrr))
      const usdt = ethersToInt(Number(usdttt))
      const xerra = ethersToInt(Number(xerraa))

      setAccount(poolSigner.address)
      setMyEtrBalance(etr)
      setMyUsdtBalance(usdt)
      setMyXerraBalance(xerra)
      setProvider(provider)
      setNetwork(network)
      setId(parseInt(Number(network?.chainId)))
      localStorage.setItem('wallet', 'connected')
    } catch (error) {
      console.error(error)
    }
  }

  const capitalize = (str) => {
    if (str == undefined) return
    let arr = str.split('')
    arr = arr.map((x) => {
      let charCode = x.charCodeAt(0)
      return charCode >= 97 && charCode <= 122
        ? String.fromCharCode(charCode - 32)
        : x
    })
    return arr.join('')
  }

  const init = async () => {
    const globalprice = 0.276
    const assumeprice = globalprice - Math.random() / 200
    const usdt = pre?.usdt
    const etr = pre?.etr
    const elec = pre?.elec
    const targetUsdt = 100
    const targetEtr = 377
    if (
      twoDp((usdt * 100) / targetUsdt) >= 100.0 &&
      twoDp((etr * 100) / targetEtr) >= 100.0
    ) {
      setSpinning(true)
    } else {
      setSpinning(false)
    }
    const price = usdt / etr
    if (price - assumeprice > 0.005) {
      const priceDiff = price - assumeprice
      //usd-0.265*xra
      const amount = usdt - assumeprice * etr
      balancerRef.current = amount
    }
  }

  const validateFundPassword = async (fundPassword) => {
    const profile = JSON.parse(window.localStorage.getItem('profile'))
    const fpw = profile?.result.fundPassword
    const isPasswordCorrect = await bcrypt.compare(fundPassword, fpw)
    if (isPasswordCorrect) return true
    else return false
  }

  const balanceFunction = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      walletModule.providerURL,
    )
    const ethWallet = new ethers.Wallet(key, provider)
    setOwnerEthWallet(ethWallet)
    const num = Math.floor((balancerRef.current * 100000) / 100000)
    const total = ethers.utils.parseEther(num.toString())
    //const yowal = walletModule.getWallet()
    await xerraFunction.ownerBalancer(total, ethWallet, navigate)
    balancerRef.current = 0
  }

  React.useEffect(() => {
    init()
    connectWallet()
    while (firstRenderRef.current < 2) {
      dispatch(getData())
      dispatch(rewardData())
      dispatch(getKey())
      dispatch(xerraFunction.getData())
      firstRenderRef.current += 1
    }
    if (balancerRef.current) {
      while (balanceExec.current < 1) {
        balanceFunction()
        balanceExec.current += 1
      }
    }
  }, [dispatch, pre])

  return (
    <ContractContext.Provider
      value={{
        navigate,
        provider,
        infuraId,
        shortenAddress,
        connectWallet,
        setAccount,
        setNetwork,
        id,
        network,
        account,
        capitalize,
        ethersToInt,
        myEtrBalance,
        myUsdtBalance,
        spinning,
        checkNum,
        showValidate,
        setShowValidate,
        toHex,
        validateFundPassword,
        setCorrect,
        correct,
        myXerraBalance,
        ownerEthWallet,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}
