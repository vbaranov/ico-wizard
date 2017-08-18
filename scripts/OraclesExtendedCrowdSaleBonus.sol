/**
 * @title OraclesExtendedCrowdsale
 * @dev This is an example of a fully fledged crowdsale.
 * The way to add new features to a base crowdsale is by multiple inheritance.
 * In this example we are providing following extensions:
 * CappedCrowdsale - sets a max boundary for raised funds
 * RefundableCrowdsale - set a min goal to be reached and returns funds if it's not met
 *
 * After adding multiple features it's good practice to run integration tests
 * to ensure that subcontracts works together as intended.
 */
contract OraclesExtendedCrowdsaleBonus is ExistedCrowdsale {

  uint256 public supply;
  uint256 public investors;

  function OraclesExtendedCrowdsaleBonus(uint256 _startBlock, uint256 _endBlock, uint256 _rate, address _wallet, uint256 _crowdsaleSupply, address _addr) ExistedCrowdsale(_startBlock, _endBlock, _rate, _wallet)
  {
    investors = 0;
    supply = _crowdsaleSupply;
    token = getTokenContract(_addr);
  }

  function buyTokensExtended(address _sender) payable {
    investors++;
    buyTokens(_sender);
  }
  
  function () payable {
    buyTokensExtended(msg.sender);
  }
}