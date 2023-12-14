import Qs from 'qs'
import constant from './constant'
import checkRule from './checkRule';
import JSEncrypt from 'jsencrypt'

/**
 * 获取URL参数
 * @returns URL参数模型
 */
function getUrlParams() {
  return Qs.parse(window.location.search.substring(1))
}

const publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwLyAYwjCwVf2Sxu2U0YeepdmIY+Rpk6+1UgOIxF9L319WTg7XIqzYaRK92eD+HPjzntXimoHemXaLav4ZccXRCvcAX1phR8YwxumVfUZAopcO7FEY/2RM0Et0SbV83bbvX2Tb6P8Np12pvDzFEfoa0bovjHBmssL3l2QArpMHdQIDAQAB"
const encrypt = new JSEncrypt();
encrypt.setPublicKey(publicKey)

export {
  constant,
  getUrlParams,
  checkRule,
  encrypt
}