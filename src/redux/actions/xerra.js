import * as contract from '../../contractObject'
import { ethers } from 'ethers'

export const gweiToInt = (num) => ethers.utils.formatUnits(num, 'gwei')
export const limit = ethers.utils.parseEther(String(1))

export const ethersToInt = (num) =>
  parseFloat(num / 1000000000000000000).toFixed(2)
export const getData = () => async (dispatch) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()

    const xerraData = await xerraContract.getXerraReserve()
    const xerra = Number(ethers.utils.formatEther(xerraData))
    const usdtData = await xerraContract.getUsdtReserve()
    const usdt = Number(ethers.utils.formatEther(usdtData))
    const usdtStakeData = await xerraContract.getMyUsdtStake()
    const usdtStake = Number(ethers.utils.formatEther(usdtStakeData))
    const yoyo = await xerraContract.balanceOf(contract.electronAddress)
    if (usdtStakeData) {
      dispatch({
        type: 'XERRA_DATA',
        payload: {
          usdt: usdt,
          xerra: xerra,
          usdtStake: usdtStake,
        },
      })
    } else {
      dispatch({
        type: 'XERRA_DATA',
        payload: {
          usdt: usdt,
          xerra: xerra,
          usdtStake: 0,
        },
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export const preBuyXerra = async (params) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()
    const [
      usdtContract,
      usdtSigner,
      usdtAddress,
    ] = await contract.usdtContractObject()
    await usdtContract.connect(xerraSigner).approve(xerraAddress, params)
    const tx = await xerraContract.connect(xerraSigner).preSaleBuyXerra(params)
    await tx.wait()
  } catch (error) {
    console.log(error)
  }
}

export const preBuyXerraGas = async (params) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()
    const [
      usdtContract,
      usdtSigner,
      usdtAddress,
    ] = await contract.usdtContractObject()
    await usdtContract.connect(xerraSigner).approve(xerraAddress, params)
    const gasData = await xerraContract.estimateGas.preSaleBuyXerra(params)
    const gas = gweiToInt(gasData)
    return gas
  } catch (error) {
    console.log(error)
  }
}

export const buyXerraGas = async (params) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()
    const [
      usdtContract,
      usdtSigner,
      usdtAddress,
    ] = await contract.usdtContractObject()
    await usdtContract.connect(xerraSigner).approve(xerraAddress, params)
    const gasData = await xerraContract.estimateGas.buyXerra(params)
    const gas = gweiToInt(gasData)
    return gas
  } catch (error) {
    console.log(error)
  }
}

export const buyXerra = async (params) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()
    const [
      usdtContract,
      usdtSigner,
      usdtAddress,
    ] = await contract.usdtContractObject()
    await usdtContract.connect(xerraSigner).approve(xerraAddress, params)
    const tx = await xerraContract.connect(xerraSigner).buyXerra(params)
    await tx.wait()
  } catch (error) {
    console.log(error)
  }
}

export const sellXerra = async (params) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()
    await xerraContract.connect(xerraSigner).approve(xerraAddress, params)
    const tx = await xerraContract.connect(xerraSigner).buyUsdt(params)
    await tx.wait()
  } catch (error) {
    console.log(error)
  }
}

export const sellXerraGas = async (params) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()
    const [
      usdtContract,
      usdtSigner,
      usdtAddress,
    ] = await contract.usdtContractObject()
    await xerraContract.connect(xerraSigner).approve(xerraAddress, params)
    const gasData = await xerraContract.estimateGas.buyUsdt(params)
    const gas = gweiToInt(gasData)
    return gas
  } catch (error) {
    console.log(error)
  }
}

export const buyUSDTBondGas = async (params) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()
    const [
      usdtContract,
      usdtSigner,
      usdtAddress,
    ] = await contract.usdtContractObject()
    await usdtContract.connect(xerraSigner).approve(xerraAddress, params)
    const gasData = await xerraContract.estimateGas.addUsdtLiquidity(params)
    const gas = gweiToInt(gasData)
    return gas
  } catch (error) {
    console.log(error)
  }
}

export const ownerBalancer = async (params, ethwallet, history) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.ownerXerraContractContract(ethwallet)
    const [
      etrContract,
      etrSigner,
      etrAddress,
    ] = await contract.ownerPoolContractObject(ethwallet)
    const [
      usdtContract,
      usdtSigner,
      usdtAddress,
    ] = await contract.ownerUsdtContractObject(ethwallet)
    await usdtContract.connect(xerraSigner).approve(etrAddress, params)
    await etrContract.estimateGas.reduceElectricityPrice(params)
    const tx1 = await etrContract
      .connect(xerraSigner)
      .reduceElectricityPrice(params)
    await tx1.wait()
    await usdtContract.connect(xerraSigner).approve(xerraAddress, params)
    await xerraContract.estimateGas.buyXerra(params)
    const tx2 = await xerraContract.connect(xerraSigner).buyXerra(params)
    await tx2.wait()
    const xerraa = await xerraContract.balanceOf(xerraSigner.address)
    await xerraContract.connect(xerraSigner).approve(xerraAddress, xerraa)
    await xerraContract.estimateGas.transfer(etrAddress, xerraa)
    const tx3 = await xerraContract
      .connect(xerraSigner)
      .transfer(etrAddress, xerraa)
    await tx3.wait()
    console.log('yo3')
    const tx4 = await etrContract
      .connect(xerraSigner)
      .updateLiquidityAfterBalancer(xerraa,{ gasLimit: 100000})
    await tx4.wait()
    console.log('yo4')
    history(0)
  } catch (error) {
    console.log(error)
  }
}

export const buyUSDTBond = async (params) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()
    const [
      usdtContract,
      usdtSigner,
      usdtAddress,
    ] = await contract.usdtContractObject()
    await usdtContract.connect(xerraSigner).approve(xerraAddress, params)
    const tx = await xerraContract.connect(xerraSigner).addUsdtLiquidity(params)
    await tx.wait()
  } catch (error) {
    console.log(error)
  }
}

export const redeemUSDTBondGas = async (params) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()
    const [
      usdtContract,
      usdtSigner,
      usdtAddress,
    ] = await contract.usdtContractObject()
    await xerraContract.connect(xerraSigner).approve(xerraAddress, params)
    const gasData = await xerraContract.estimateGas.withdrawUsdtLiquidity(
      params,
      { gasLimit: 100000 },
    )
    const gas = gweiToInt(gasData)
    return gas
  } catch (error) {
    console.log(error)
  }
}

export const redeemUSDTBond = async (params) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()
    const [
      usdtContract,
      usdtSigner,
      usdtAddress,
    ] = await contract.usdtContractObject()
    await xerraContract.connect(xerraSigner).approve(xerraAddress, params)
    const tx = await xerraContract
      .connect(xerraSigner)
      .withdrawUsdtLiquidity(params, { gasLimit: 100000 })
    await tx.wait()
  } catch (error) {
    console.log(error)
  }
}

export const getXerraReserve = async () => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()

    const xerraReserve = await xerraContract.getXerraReserve()
    return ethersToInt(xerraReserve)
  } catch (error) {
    console.log(error)
  }
}

export const getUsdtReserve = async () => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()

    const usdtReserve = await xerraContract.getUsdtReserve()
    return ethersToInt(usdtReserve)
  } catch (error) {
    console.log(error)
  }
}

export const getUsdtAmount = async (params) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()

    const amount = await xerraContract.getUsdtAmount(params)
    return ethersToInt(amount)
  } catch (error) {
    console.log(error)
  }
}

export const getXerraAmount = async (params) => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()

    const amount = await xerraContract.getXerraAmount(params)
    return ethersToInt(amount)
  } catch (error) {
    console.log(error)
  }
}

export const getPreXerraAmount = async (params) => {
  try {
    const amount = params / 0.2
    return amount
  } catch (error) {
    console.log(error)
  }
}

export const getPreXerraPrice = async () => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()

    const priceData = await xerraContract.calculatePreSale()
    const readablePrice = Number(priceData)
    return 1 / readablePrice
  } catch (error) {
    console.log(error)
  }
}

export const getMyUsdtStake = async () => {
  try {
    const [
      xerraContract,
      xerraSigner,
      xerraAddress,
    ] = await contract.xerraContractObject()

    const priceData = await xerraContract.getMyUsdtStake()
    const price = ethersToInt(priceData)
    return price
  } catch (error) {
    console.log(error)
  }
}
