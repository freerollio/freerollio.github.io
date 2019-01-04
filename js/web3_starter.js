window.addEventListener('load', async () => {

    // First see you browser has a web3 injection
    if (typeof web3 === 'undefined') {

        // If not throw error
        $('body').addClass('error-no-metamask-plugin').addClass('error');

        return

    // If yes get the account access
    } else {
        // *** Pattern for sites which need account address access **************
        // Modern dapp browsers...
        if (window.ethereum) {

            window.web3 = new Web3(ethereum);

            try {
                // Request account access if needed
                await ethereum.enable();
                var accountAddressNeeded = true;
                checkNetwork(accountAddressNeeded);

            } catch (error) {
                // throw err message
                $('body').addClass('error-no-account-access').addClass('error');
            }
        // Legacy dapp browsers...
        } else if (window.web3) {

            window.web3 = new Web3(web3.currentProvider);

            // Call network check
            var accountAddressNeeded = true;
            checkNetwork(accountAddressNeeded);
        }
        //*************************************************************************

        // *** Pattern for stites which do NOT need account address access ********
        // if (window.ethereum) {
        //     window.web3 = new Web3(ethereum);
        //     var accountAddressNeeded = false
        //     checkNetwork(accountAddressNeeded);
        // }
        // else if (window.web3) {
        //     window.web3 = new Web3(web3.currentProvider);
        //     checkNetwork(accountAddressNeeded);
        // }

        //**************************************************************************

        // Non-dapp browsers... (no metamask plugin)
        else {
            $('body').addClass('error-no-metamask-plugin').addClass('error');
        }
    }
});

function checkNetwork(_accountAddressNeeded) {

    // Network check; else throw error
    web3.version.getNetwork((err, netId) => {

      switch (netId) {
        case "1":
          console.log('This is mainnet');
          accountCheck(_accountAddressNeeded);
          break
        case "2":
          console.log('This is the deprecated Morden test network.');
          $('body').addClass('error-invalid-network').addClass('error');
          break
        case "3":
          console.log('This is the ropsten test network.');
          $('body').addClass('error-invalid-network').addClass('error');
          break
        case "4":
          console.log('This is the Rinkeby test network.');
          $('body').addClass('error-invalid-network').addClass('error');
          break
        case "42":
          console.log('This is the Kovan test network.');
          $('body').addClass('error-invalid-network').addClass('error');
          break
        default:
          console.log('This is an unknown network.');
          $('body').addClass('error-invalid-network').addClass('error');
      }
  });
}

function accountCheck(_accountAddressNeeded) {
    window.web3.eth.getAccounts((err, acc) => {

        if (!err) {
            console.log('here in accountcheck');
            console.log('accountAddressNeeded: ' + _accountAddressNeeded);

            if (_accountAddressNeeded) {

                if (acc.length <= 0) {
                    $('body').addClass('error-no-metamask-accounts').addClass('error');

                } else {
                    web3.eth.defaultAccount = web3.eth.accounts[0];
                    console.log("Active account: " + web3.eth.defaultAccount);
                    // Call set abi
                    fireUponPageLoad();
                }
            }
            else {
                console.log('No account address needed');
                fireUponPageLoad();
            }

       } else {
          // Terribly wrong error message
       }
   });
}




// web3 opjects (factoryInstance and freerollABI)
var factoryABI = web3.eth.contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "_descr",
				"type": "string"
			},
			{
				"name": "_receiver",
				"type": "address"
			},
			{
				"name": "_charity",
				"type": "bool"
			},
			{
				"name": "_category",
				"type": "uint256"
			},
			{
				"name": "_duration",
				"type": "uint256"
			},
			{
				"name": "_location",
				"type": "string"
			}
		],
		"name": "newFreeroll",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "version",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_version",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_poster",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_description",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_charity",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "_category",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_location",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_duration",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_freeroll_addr",
				"type": "address"
			}
		],
		"name": "FreerollLog",
		"type": "event"
	}
]);

var factoryAddress = '0x451b453E8B8450366F8d309Db8B36E76Ee17177D'; // Mainnet Testnet Factory Address

// Main Net: 0x451b453E8B8450366F8d309Db8B36E76Ee17177D; Block height: 6771111;
// Testnet Ropsten address: 0xF15CD8C7a4c7e28505519765a3470fc691D8D94E; Block height: 4449994;

var factoryInstance = factoryABI.at(factoryAddress); // Connecting Factory ABI and Address

var freerollABI = web3.eth.contract([
	{
		"constant": true,
		"inputs": [],
		"name": "end_date",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "poster",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "posterWon",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "posterLost",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "receiver",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_poster",
				"type": "address"
			},
			{
				"name": "_receiver",
				"type": "address"
			},
			{
				"name": "_duration",
				"type": "uint256"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	}
]);
