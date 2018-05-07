import Web3 from 'web3'
import { observable } from 'mobx';
import { getQueryVariable } from '../utils/utils'
import { CrowdsaleConfig } from '../components/Common/config'
import { CHAINS } from '../utils/constants'

class Web3Store {

  @observable web3;
  @observable curAddress
  @observable accounts

  constructor(strategies) {
    this.getWeb3((web3) => {
      if (web3) {
        this.web3 = web3
        web3.eth.getAccounts().then((accounts) => {
          this.accounts = accounts
          this.curAddress = accounts[0]
        })
      }
    })
  }

  getInfuraLink = (network) => {
    return `https://${network}.infura.io/${process.env['REACT_APP_INFURA_TOKEN']}`
  }

  getWeb3 = cb => {
    const networkID = CrowdsaleConfig.networkID ? CrowdsaleConfig.networkID : getQueryVariable('networkID')
    var web3 = window.web3;
    if (typeof web3 === 'undefined') {
      // no web3, use fallback
      console.error("Please use a web3 browser");
      const devEnvironment = process.env.NODE_ENV === 'development';
      if (devEnvironment) {
        web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      } else {
        let infuraLink
        switch(networkID) {
          case 1:
            infuraLink = this.getInfuraLink(CHAINS.MAINNET)
            break
          case 2:
            infuraLink = this.getInfuraLink(CHAINS.MORDEN)
            break
          case 3:
            infuraLink = this.getInfuraLink(CHAINS.ROPSTEN)
            break
          case 4:
            infuraLink = this.getInfuraLink(CHAINS.RINKEBY)
            break
          case 42:
            infuraLink = this.getInfuraLink(CHAINS.KOVAN)
            break
          default:
            infuraLink = this.getInfuraLink(CHAINS.MAINNET)
            break
        }
        web3 = new Web3(new Web3.providers.HttpProvider(infuraLink));
      }

      cb(web3, false);
      return web3;
    } else {
      // window.web3 == web3 most of the time. Don't override the provided,
      // web3, just wrap it in your Web3.
      var myWeb3 = new Web3(web3.currentProvider);

      cb(myWeb3, false);
      return myWeb3;
    }
  }
}

export default Web3Store;
