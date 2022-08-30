const { ethers } = require('ethers')
const Electron = artifacts.require('Electron')
const usdt = artifacts.require('USDT')
const Xerra = artifacts.require('Xerra')
const uniswap = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const usdtaddr = '0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD'
const usdTSupply = ethers.utils.parseEther('100000000')
const usdTTSupply = ethers.utils.parseEther('1000000')
const etrSupply = ethers.utils.parseEther('3700000')
const xerraTarget = ethers.utils.parseEther('1000000')

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(usdt, usdTSupply)
  const usdtCon = await usdt.deployed()
  // console.log(usdtCon.address)

  await deployer.deploy(Xerra, usdtCon.address, xerraTarget)
  const xerra = await Xerra.deployed()

  await deployer.deploy(
    Electron,
    usdtCon.address,
    usdTTSupply,
    etrSupply,
    xerra.address,
  )
  const electron = await Electron.deployed()
  await usdtCon.approve(electron.address, usdTTSupply)
  await electron.addTokenLiquidity(usdTTSupply)
  await electron.electricityToEtr(etrSupply)
  await electron.approve(electron.address, etrSupply)
  await electron.addEtrLiquidity(etrSupply)
  await usdtCon.approve(xerra.address, usdTTSupply)
  await xerra.preSaleBuyXerra(usdTTSupply)
  //await electronToken.transfer(electricGenerator.address, electricGenerator.totalSupply())
}
