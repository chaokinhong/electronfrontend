import * as contract from '../../contractObject'
import { ethers } from 'ethers'
import * as api from '../api'
import * as xerraFuntion from './xerra'

export const ethersToInt = (num) =>
  parseFloat(num / 1000000000000000000).toFixed(2)
export const gweiToInt = (num) => ethers.utils.formatUnits(num, 'gwei')
export const lockUsdt = async (params, history) => {
  try {
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
    await usdtContract.connect(poolSigner).approve(poolAddress, params)
    const usdtadd = await poolContract
      .connect(poolSigner)
      .addTokenLiquidity(params)
    await usdtadd.wait()
  } catch (error) {
    console.log(error)
  }
}

export const lockEtr = async (params, history) => {
  try {
    const [
      poolContract,
      poolSigner,
      poolAddress,
    ] = await contract.poolContractObject()
    await poolContract.connect(poolSigner).approve(poolAddress, params)
    const etradd = await poolContract
      .connect(poolSigner)
      .addEtrLiquidity(params)
    await etradd.wait()
  } catch (error) {
    console.log(error)
  }
}

export const lockElecAndStake = async (params, history) => {
  try {
    const [
      poolContract,
      poolSigner,
      poolAddress,
    ] = await contract.poolContractObject()
    const elecadd = await poolContract.electricityToEtr(params)
    await elecadd.wait()
    await lockEtr(params)
  } catch (error) {
    console.log(error)
  }
}

export const lockElecGas = async (params) => {
  try {
    const [
      poolContract,
      poolSigner,
      poolAddress,
    ] = await contract.poolContractObject()
    const gasData = await poolContract.estimateGas.electricityToEtr(params)
    const gas = gweiToInt(gasData)
    return gas
  } catch (error) {
    console.log(error)
  }
}

export const lockElec = async (params) => {
  try {
    const [
      poolContract,
      poolSigner,
      poolAddress,
    ] = await contract.poolContractObject()
    const tx = await poolContract.electricityToEtr(params)
    await tx.wait()
  } catch (error) {
    console.log(error)
  }
}

export const getData = () => async (dispatch) => {
  try {
    const [
      poolContract,
      poolSigner,
      poolAddress,
    ] = await contract.poolContractObject()

    const usdtData = await poolContract.getTotalTokenReserve()
    const usdt = Number(ethers.utils.formatEther(usdtData))
    const etrData = await poolContract.getTotalEtrReserve()
    const etr = Number(ethers.utils.formatEther(etrData))
    const elecData = await poolContract.getTotalEtrSupply()
    const elec = Number(ethers.utils.formatEther(elecData))

    dispatch({
      type: 'FETCH_DATA',
      payload: {
        usdt: usdt,
        etr: etr,
        elec: elec,
      },
    })
  } catch (error) {
    console.log(error)
  }
}

export const rewardData = () => async (dispatch) => {
  try {
    const [
      poolContract,
      poolSigner,
      poolAddress,
    ] = await contract.poolContractObject()

    const myTokenStakeData = await poolContract.getMyTokenStakeBalance()
    const myTokenStake = Number(ethers.utils.formatEther(myTokenStakeData))
    const myEtrStakeData = await poolContract.getMyEtrStakeBalance()
    const myEtrStake = Number(ethers.utils.formatEther(myEtrStakeData))

    const totalRewardBalanceData = await poolContract.getTotalTokenRewardBalance()
    const totalRewardBalance = Number(
      ethers.utils.formatEther(totalRewardBalanceData),
    )
    const myXerra = await getXerraStakeBalance()

    const xerraInUSDT = await xerraFuntion.getUsdtAmount(myXerra[1])

    // const myRewardData = await poolContract.getMyTokenReward()
    // const myReward = Number(ethers.utils.formatEther(myRewardData))

    dispatch({
      type: 'REWARD_DATA',
      payload: {
        myTokenStake: myTokenStake,
        myEtrStake: myEtrStake,
        totalRewardBalance: totalRewardBalance,
        myXerra: xerraInUSDT || 0,
        // myReward: myReward,
      },
    })
  } catch (error) {
    console.log(error)
  }
}

export const withdrawUsdt = async (params, history) => {
  try {
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

    await usdtContract.connect(poolSigner).approve(poolAddress, params)
    const [readableXerra, xerraAmount] = await getXerraStakeBalance()
    console.log(readableXerra)
    if (readableXerra != 0) {
      await xerraContract.connect(poolSigner).approve(xerraAddress, xerraAmount)
      await xerraContract.connect(poolSigner).approve(poolAddress, xerraAmount)
      const handleUsdtInXra = await poolContract
        .connect(poolSigner)
        .handleWithdrawLiquidityInXra()
      await handleUsdtInXra.wait()
      const usdtadd = await poolContract
        .connect(poolSigner)
        .withdrawTokenLiquidity(params)
      await usdtadd.wait()
    } else {
      const usdtadd = await poolContract
        .connect(poolSigner)
        .withdrawTokenLiquidity(params)
      await usdtadd.wait()
    }

    if (readableXerra != 0) {
      await xerraFuntion.sellXerra(xerraAmount, { gasLimit: 100000 })
    }
  } catch (error) {
    console.log(error)
  }
}

export const withdrawUsdtEstimateGas = async (params, ethWallet) => {
  try {
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
    await usdtContract.connect(poolSigner).approve(poolAddress, params)
    const [readableXerra, xerraAmount] = await getXerraStakeBalance()
    console.log(readableXerra)
    if (readableXerra != 0) {
      const handleUsdtInXraGas = await poolContract.estimateGas.handleWithdrawLiquidityInXra()
      const usdtaddGas = await poolContract.estimateGas.withdrawTokenLiquidity(
        params,
      )
      const gas =
        Number(gweiToInt(handleUsdtInXraGas)) + Number(gweiToInt(usdtaddGas))
      console.log(gas)
      return gas
    } else {
      const gasData = await poolContract.estimateGas.withdrawTokenLiquidity(
        params,
      )
      const gas = gweiToInt(gasData)
      return gas
    }
  } catch (error) {
    console.log(error)
  }
}

export const getXerraStakeBalance = async () => {
  try {
    const [
      poolContract,
      poolSigner,
      poolAddress,
    ] = await contract.poolContractObject()

    const myXerra = await poolContract.getXerraStakeBalance()

    return [ethersToInt(Number(myXerra)), myXerra]
  } catch (error) {
    console.log(error)
  }
}

export const withdrawEtrEstimateGas = async (params) => {
  try {
    const [
      poolContract,
      poolSigner,
      poolAddress,
    ] = await contract.poolContractObject()
    await poolContract.connect(poolSigner).approve(poolAddress, params)

    const gasData = await poolContract.estimateGas.withdrawEtrLiquidity(params)
    const gas = gweiToInt(gasData)
    return gas
  } catch (error) {
    console.log(error)
  }
}
export const withdrawEtr = async (params, history) => {
  try {
    const [
      poolContract,
      poolSigner,
      poolAddress,
    ] = await contract.poolContractObject()
    await poolContract.connect(poolSigner).approve(poolAddress, params)
    const etradd = await poolContract
      .connect(poolSigner)
      .withdrawEtrLiquidity(params)
    await etradd.wait()
  } catch (error) {
    console.log(error)
  }
}

export const etr2Electricity = async (params) => {
  try {
    const [
      poolContract,
      poolSigner,
      poolAddress,
    ] = await contract.poolContractObject()
    const elecadd = await poolContract.etrToElectricity(params)
    await elecadd.wait()
  } catch (error) {
    console.log(error)
  }
}

export const etr2ElectricityGas = async (params) => {
  try {
    const [
      poolContract,
      poolSigner,
      poolAddress,
    ] = await contract.poolContractObject()
    const gasData = await poolContract.estimateGas.etrToElectricity(params)
    const gas = gweiToInt(gasData)
    return gas
  } catch (error) {
    console.log(error)
  }
}

export const tokenBuy = async (params) => {
  try {
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
    console.log(params)

    await usdtContract.connect(poolSigner).approve(poolAddress, params)
    const tx = await poolContract.connect(poolSigner).tokenToEtrSwap(params)
    await tx.wait()
  } catch (error) {
    console.log(error)
  }
}

export const etrBuy = async (params) => {
  try {
    const [
      poolContract,
      poolSigner,
      poolAddress,
    ] = await contract.poolContractObject()
    await poolContract.connect(poolSigner).approve(poolAddress, params)
    const tx = await poolContract.connect(poolSigner).EtrToTokenSwap(params)
    await tx.wait()
  } catch (error) {
    console.log(error)
  }
}

export const tokenBuyGas = async (params) => {
  try {
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

    await usdtContract.connect(poolSigner).approve(poolAddress, params)
    const gasData = await poolContract.estimateGas.tokenToEtrSwap(params)
    const gas = gweiToInt(gasData)
    return gas
  } catch (error) {
    console.log(error)
  }
}

export const etrBuyGas = async (params) => {
  try {
    const [
      poolContract,
      poolSigner,
      poolAddress,
    ] = await contract.poolContractObject()
    await poolContract.connect(poolSigner).approve(poolAddress, params)
    const gasData = await poolContract.estimateGas.EtrToTokenSwap(params)
    const gas = gweiToInt(gasData)
    return gas
  } catch (error) {
    console.log(error)
  }
}

export const getKey = () => async (dispatch) => {
  const { data } = await api.getKey()
  dispatch({ type: 'KEY_DATA', payload: data })
}
