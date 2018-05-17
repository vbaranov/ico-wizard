import { observable, action, computed } from 'mobx';
import { VALIDATION_TYPES } from '../utils/constants'
import autosave from './autosave'
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES;

class TokenStore {

  @observable name;
  @observable ticker;
  @observable supply;
  @observable decimals;
  @observable validToken;
  @observable reservedTokensInput;

  constructor() {
    this.reset()
    autosave(this, 'TokenStore')
  }

  @action reset = () => {
    this.name = undefined
    this.ticker = undefined
    this.supply = 0
    this.decimals = undefined
    this.validToken = {
      'name': EMPTY,
      'ticker': EMPTY,
      'decimals': EMPTY
    }
    this.reservedTokensInput = {}
  }

  @action setProperty = (property, value) => {
    this[property] = value;
  }

  @action updateValidity = (property, validity) => {
    this.validToken[property] = validity
  }

  @action invalidateToken = () => {
    if (!this.validToken) {
      return;
    }

    Object.keys(this.validToken).forEach(key => {
      if (this.validToken[key] === EMPTY) {
        this.validToken[key] = INVALID;
      }
    });
  }

  // Getters
  @computed get isTokenValid() {
    if (!this.validToken) {
      return;
    }

    const validKeys = Object.keys(this.validToken).filter((key) => {
      if (this.validToken[key] === VALID) {
        return true;
      } else {
        return false;
      }
    });
    return validKeys.length === Object.keys(this.validToken).length
  }
}

export default TokenStore;
