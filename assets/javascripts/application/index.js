var octo = new Octokat({token: "minimal_github_token"});

var parentDir = 'contracts/crowdsale/';

$(function() {
	generateFlatSol('contracts/crowdsale/Crowdsale.sol', function(content) {
		$("#crowdsale_flat_src").text(content);
		console.log(unescape(content));
	});

	generateFlatSol('contracts/crowdsale/CappedCrowdsale.sol', function(content) {
		$("#capped_crowdsale_flat_src").text(content);
		console.log(unescape(content));
	});
});