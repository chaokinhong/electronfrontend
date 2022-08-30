import Web3 from 'web3'
import { ethers } from 'ethers'

export const providerURL = 'https://rinkeby.infura.io/v3/44096091314c4325854f2bfdbac703da'
// export const providerURL = 'http://localhost:7545'
const web3 = new Web3(providerURL)

export const createWallet = () => {
  const wallet = web3.eth.accounts.create()
  const privateKey = wallet.privateKey
  return privateKey
}

export const encryptWallet = (wallet, password) => {
  const encryptedWallet = web3.eth.accounts.encrypt(wallet, password)
  const walletString = JSON.stringify(encryptedWallet)
  const textEncoder = new TextEncoder()
  const walletBytes = textEncoder.encode(walletString)
  const buffer = Buffer.from(walletBytes)
  return buffer
}

export const decryptWallet = (walletBuffer, password) => {
  const textDecoder = new TextDecoder()
  const walletString = textDecoder.decode(walletBuffer)
  const wallet = web3.eth.accounts.decrypt(walletString, password)
  return wallet
}

export const getWallet =  () => {
  const profile = JSON.parse(window.localStorage.getItem('profile'))
  const myWalletBytes = new Uint8Array(profile?.result.wallet.data)
  const fpw = profile?.result.fundPassword
  const myWallet = decryptWallet(myWalletBytes, fpw)
  const provider = new ethers.providers.JsonRpcProvider(providerURL)
  const ethWallet = new ethers.Wallet(myWallet.privateKey,provider)
  return ethWallet
}
