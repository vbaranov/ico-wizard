import React, { Component } from 'react';
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { setFlatFileContentToState } from '../utils/utils';
import { defaultState } from '../utils/constants'

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState
  }

  addContractsToState (src, bin, abi, isBonus) {
    let newState = Object.assign({}, this.state)
    newState.contracts[isBonus?"bonus":"crowdsale"] = {
      src,
      bin,
      abi: JSON.parse(abi)
    }
    this.setState(newState)
  }

  componentDidMount() {
    //const contractName = "RomanCrowdsale";
    const contractName = "OraclesExtendedCrowdsale";
    let src, bin
    setFlatFileContentToState("./contracts/" + contractName + "_flat.sol", (content) => src = content);
    setFlatFileContentToState("./contracts/" + contractName + "_flat.bin", (_bin) => bin = _bin);
    setFlatFileContentToState("./contracts/" + contractName + "_flat.abi", (_abi) => this.addContractsToState(src, bin, _abi));

    const bonusContractName = "OraclesExtendedCrowdsaleBonus";
    let srcBonus, binBonus
    setFlatFileContentToState("./contracts/" + bonusContractName + "_flat.sol", (content) => srcBonus = content);
    setFlatFileContentToState("./contracts/" + bonusContractName + "_flat.bin", (_bin) => binBonus = _bin);
    setFlatFileContentToState("./contracts/" + bonusContractName + "_flat.abi", (_abi) => this.addContractsToState(srcBonus, binBonus, _abi, true));
  }

  render() {
    return (
      <div>
        <section className="home">
          <div className="crowdsale">
            <div className="container">
              <h1 className="title">Create crowdsale</h1>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  commodo consequat.
              </p>
              <div className="buttons">
                <Link to={{ pathname: '/1', query: { state: this.state } }}><a className="button button_fill">New crowdsale</a></Link>
              </div>
            </div>
          </div>
          <div className="process">
            <div className="container">
              <div className="process-item">
                <div className="step-icons step-icons_crowdsale-contract"></div>
                <p className="title">Crowdsale Contract</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_token-setup"></div>
                <p className="title">Token Setup</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_crowdsale-setup"></div>
                <p className="title">Crowdsale Setup</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_publish"></div>
                <p className="title">Publish</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_crowdsale-page"></div>
                <p className="title">Crowdsale Page</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}