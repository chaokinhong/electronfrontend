import * as contract from '../../contractObject'
import { ethers } from 'ethers'

export const preReducer = (
  pre = {
    usdt: 0,
    etr: 0,
    elec: 0,
    totalRewardBalance: 0,
    myReward: 0,
    myTokenPercentage: 0,
    myEtrPercentage: 0,
    currentPrice: 0,
  },
  action,
) => {
  switch (action.type) {
    case 'FETCH_DATA':
      return action.payload
    default:
      return pre
  }
}

export const rewardReducer = (
  state = {
    totalRewardBalance: 0,
    myXerra: 0,
    myTokenPercentage: 0,
    myEtrPercentage: 0,
  },
  action,
) => {
  switch (action.type) {
    case 'REWARD_DATA':
      return action.payload
    default:
      return state
  }
}

export const keyReducer = (state = '', action) => {
  switch (action.type) {
    case 'KEY_DATA':
      return action.payload
    default:
      return state
  }
}

export const xerraDataReducer = (
  state = {
    usdt: 0,
    xerra: 0,
    usdtStake: 0,
  },
  action,
) => {
  switch (action.type) {
    case 'XERRA_DATA':
      return action.payload
    default:
      return state
  }
}
