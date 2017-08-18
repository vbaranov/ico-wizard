import React from 'react'
import '../assets/stylesheets/application.css';
import { deployContract, getWeb3, getNetworkVersion, getTokenAddr } from '../utils/web3'
import { noMetaMaskAlert } from '../utils/alerts'
import { defaultState } from '../utils/constants'
import { getOldState } from '../utils/utils'
import { getEncodedABI } from '../utils/microservices'
import { stepTwo } from './stepTwo'
import { StepNavigation } from './Common/StepNavigation'
import { DisplayField } from './Common/DisplayField'
import { NAVIGATION_STEPS } from '../utils/constants'

const { PUBLISH } = NAVIGATION_STEPS

export class stepFour extends stepTwo {
  constructor(props) {
    super(props);
    let oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, oldState)
  }

  componentDidMount() {
    let abiCrowdsale = this.state.contracts && this.state.contracts.crowdsale && this.state.contracts.crowdsale.abi || []
    let $this = this;
    let state = { ...this.state }
    setTimeout(function() {
       getWeb3((web3) => {
         getEncodedABI(abiCrowdsale, state, $this);
      });
    });
  }

  handleDeployedContract = (err, crowdsaleAddr) => {
    if (err) return console.log(err);
    let newState = { ...this.state }
    newState.contracts.crowdsale.addr = crowdsaleAddr;
    this.setState(newState);

    getWeb3((web3) => {
      getTokenAddr(web3, this.state.contracts.crowdsale.abi, this.state.contracts.crowdsale.addr, (tokenCntrctAddr) => {
        console.log("tokenCntrctAddr: " + tokenCntrctAddr);
        var paramsCrowdsaleBonus = this.getCrowdSaleBonusParams(web3, this.state.crowdsale, tokenCntrctAddr)
        deployContract(web3, this.state.contracts.bonus.abi, this.state.contracts.bonus.bin, paramsCrowdsaleBonus, this.handleDeployedBonusContract)
      });
    })
  }

  handleDeployedBonusContract = (err, crowdsaleBonusAddr) => {
    if (err) return console.log(err);
    let newState = { ...this.state }
    newState.contracts.bonus.addr = crowdsaleBonusAddr;
    this.setState(newState);
    console.log(this.state);
    let crowdsalePage = "/crowdsale";
    const {contracts} = this.state
    const isValidContract = contracts && contracts.crowdsale && contracts.crowdsale.addr
    let newHistory = isValidContract ? crowdsalePage + `?addr=` + contracts.crowdsale.addr + `&bonus=` + contracts.bonus.addr + `&networkID=` + contracts.crowdsale.networkID : crowdsalePage
    this.props.history.push(newHistory);
  }

  getCrowdSaleParams = (web3, crowdsale) => {
    return [
      parseInt(crowdsale.startBlock, 10), 
      parseInt(crowdsale.endBlock, 10), 
      web3.toWei(crowdsale.rate, "ether"), 
      crowdsale.walletAddress,
      parseInt(this.state.crowdsale.supply, 10),
      this.state.token.name,
      this.state.token.ticker,
      parseInt(this.state.token.decimals, 10),
      parseInt(this.state.token.supply, 10)
    ]
  }

  getCrowdSaleBonusParams = (web3, crowdsale, tokenCntrctAddr) => {
    return [
      parseInt(crowdsale.startBlock, 10), 
      parseInt(crowdsale.endBlock, 10), 
      web3.toWei(crowdsale.rate, "ether"), 
      crowdsale.walletAddress,
      parseInt(this.state.crowdsale.supply, 10),
      tokenCntrctAddr
    ]
  }

  deployCrowdsale = () => {
    getWeb3((web3) => {
      getNetworkVersion(web3, (_networkID) => {
        if (web3.eth.accounts.length === 0) {
          return noMetaMaskAlert();
        }
        let newState = { ...this.state }
        newState.contracts.crowdsale.networkID = _networkID;
        this.setState(newState);
        var contracts = this.state.contracts;
        var binCrowdsale = contracts && contracts.crowdsale && contracts.crowdsale.bin || ''
        var abiCrowdsale = contracts && contracts.crowdsale && contracts.crowdsale.abi || []
        var crowdsale = this.state.crowdsale;
        var paramsCrowdsale = this.getCrowdSaleParams(web3, crowdsale)
        deployContract(web3, abiCrowdsale, binCrowdsale, paramsCrowdsale, this.handleDeployedContract)
       });
    });
  }

  render() {
    return (
      <section className="steps steps_publish">
        <StepNavigation activeStep={PUBLISH} />
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_publish"></div>
            <p className="title">Publish</p>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
          <div className="hidden">
            <div className="item">
              <div className="publish-title-container">
                <p className="publish-title" data-step="1">Crowdsale Contract</p>
              </div>
              <p className="label">Standard</p>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div className="publish-title-container">
              <p className="publish-title" data-step="2">Token Setup</p>
            </div>
            <div className="hidden">
              <DisplayField side='left' title={'Name'} value={this.state.token.name?this.state.token.name:"Token Name"}/>
              <DisplayField side='right' title={'Ticker'} value={this.state.token.ticker?this.state.token.ticker:"Ticker"}/>
              <DisplayField side='left' title={'SUPPLY'} value={this.state.token.supply?this.state.token.supply:100}/>
              <DisplayField side='right' title={'DECIMALS'} value={this.state.token.decimals?this.state.token.decimals:485}/>
            </div>
            <div className="publish-title-container">
              <p className="publish-title" data-step="3">Crowdsale Setup</p>
            </div>
            <div className="hidden">
              <DisplayField side='left' title={'Start time'} value={this.state.crowdsale.startTime?this.state.crowdsale.startTime.split("T").join(" "):""}/>
              <DisplayField side='right' title={'End time'} value={this.state.crowdsale.endTime?this.state.crowdsale.endTime.split("T").join(" "):""}/>
              <DisplayField side='left' title={'Wallet address'} value={this.state.crowdsale.walletAddress?this.state.crowdsale.walletAddress:"0xc1253365dADE090649147Db89EE781d10f2b972f"}/>
              <DisplayField side='right' title={'RATE'} value={this.state.crowdsale.rate?this.state.crowdsale.rate:1 + " ETH"}/>
            </div>
            <div className="publish-title-container">
              <p className="publish-title" data-step="4">Crowdsale Setup</p>
            </div>
            <div className="item">
              <p className="label">Compiler Version</p>
              <p className="value">0.4.14</p>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="item">
              <p className="label">Contract Source Code</p>
              <pre>
                {this.state.contracts?this.state.contracts.crowdsale?this.state.contracts.crowdsale.src:"":""}
              </pre>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="item">
              <p className="label">Contract ABI</p>
              <pre>
                {this.state.contracts?this.state.contracts.crowdsale?JSON.stringify(this.state.contracts.crowdsale.abi):"":""}
              </pre>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="item">
              <p className="label">Constructor Arguments (ABI-encoded and appended to the ByteCode above)</p>
              <pre>
                {this.state.contracts?this.state.contracts.crowdsale?this.state.contracts.crowdsale.abiConstructor:"":""}
              </pre>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
        <div className="button-container">
          {/*<Link to='/5' onClick={this.deployCrowdsale}><a href="#" className="button button_fill">Continue</a></Link>*/}
          <a onClick={this.deployCrowdsale} className="button button_fill">Continue</a>
        </div>
      </section>
    )}
}