import { ethers } from 'ethers'
import Pool from './abis/Electron.json'
import USDT from './abis/USDT.json'
import ElectronDAO from './abis/Xerra.json'
import * as walletModule from './walletModule/wallet'

export const usdtAddress = '0x33de451B1FD98F5B28789C53178283Af5c334679'
export const xerraAddress = '0x34Cb0243CD2dd4eA0CDA130C4da594A61785b962'
export const electronAddress = '0xC6B31e8Cb4A814673a7d0d6b4060AD3a206114E8'

export const poolContractObject = async () => {
  const wallet = walletModule.getWallet()
  const contract = new ethers.Contract(electronAddress, Pool.abi, wallet)
  return [contract, wallet, electronAddress]
}

export const usdtContractObject = async () => {
  const wallet = walletModule.getWallet()
  const contract = new ethers.Contract(usdtAddress, USDT.abi, wallet)
  return [contract, wallet, usdtAddress]
}

export const xerraContractObject = async () => {
  const wallet = walletModule.getWallet()
  const contract = new ethers.Contract(xerraAddress, ElectronDAO.abi, wallet)
  return [contract, wallet, xerraAddress]
}

export const ownerXerraContractContract = async (wallet) => {
  const contract = new ethers.Contract(xerraAddress, ElectronDAO.abi, wallet)
  return [contract, wallet, xerraAddress]
}

export const ownerUsdtContractObject = async (wallet) => {
  const contract = new ethers.Contract(usdtAddress, USDT.abi, wallet)
  return [contract, wallet, usdtAddress]
}

export const ownerPoolContractObject = async (wallet) => {
  const contract = new ethers.Contract(electronAddress, Pool.abi, wallet)
  return [contract, wallet, electronAddress]
}

export const handleDecimel = (num) => {
  const newNum = Math.floor((num * 100000) / 100000)
  return newNum
}
