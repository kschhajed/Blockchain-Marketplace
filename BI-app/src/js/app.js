let x = []
let image = localStorage.getItem("image") ? JSON.parse(localStorage.getItem("image")) : {}
App = {
  web3: null,
  contracts: {},
  url: 'http://127.0.0.1:7545',
  network_id:3, // 5777 for local
  seller:null,
  current_address: null,
  value:1000000000000000000,
  index:0,
  margin:10,
  left:15,
  init: function() {
    console.log("Initiating Web3 Provider")
    return App.initWeb3();
  },

  initWeb3: function() {    
    console.log("Initiating Web3 Provider")     
    if (window.ethereum){
		web3 = new Web3(web3.currentProvider);
		try {
		  //Request account access
		window.ethereum.request({ method: "eth_requestAccounts" });
		} catch (error) {
		  // User denied account access...
		  console.error("User denied account access");
		}
		App.web3Provider = web3.currentProvider;
		console.log("modern dapp browser");
	  }
	  // Legacy dapp browsers...
	  else if (window.web3) {
		App.web3Provider = window.web3.currentProvider;
		console.log("legacy dapp browser");
	  }
	  // if no injected web3 instance is detected, fall back to Ganache
	  else {
		App.web3Provider = new Web3.providers.HttpProvider(App.url);
	  }

	  web3 = new Web3(App.web3Provider);
  
	//   App.populateAddress();   
	  return App.initContract();  
  },

  initContract: function() { 
	$.getJSON('BI.json', function(data) {
		// Get the necessary contract artifact file and instantiate it with truffle-contract
		var bi = data;
		App.contracts.BI = TruffleContract(bi);
	
		// Set the provider for our contract
		App.contracts.BI.setProvider(web3.currentProvider);	 

		console.log("Initiating Web3 contracts")
		console.log(App.contracts.BI)
	  });

    return App.bindEvents();
  },  

  bindEvents: function() {  

    $(document).on('click', '#registerbuy', function(){
      App.handleRegisterBuyer();
    });

	$(document).on('click', '#registersell', function(){
		App.handleRegisterSeller();
	  });

	  $(document).on('click', '#buyerbalance', function(){
		App.handleBuyerBalance();
	  });
	  
	  $(document).on('click', '#products', function(){
		App.handleProducts();
	  });

	  $(document).on('click', '#totalItems', function(){
		App.handleTotalItems();
	  });
	  $(document).on('click', '#totalItems', function(){
		App.handleTransferredProducts();
	  });

    $(document).on('click', '#buyrequest',function(){
      App.handlebuy(jQuery('#pid').val(), jQuery('#buyadress').val());
    });

    $(document).on('click', '#sellrequest', function(){

		var id = jQuery('#ID').val()
		// var itmcnt = jQuery('#itemscount').val()
		var owner = jQuery('#owner').val()
		var cost = jQuery('#cost').val()
		var desc = jQuery('#desc').val()
      App.handlesell(id, owner, cost, desc)
    });
    
  },  
  handleRegisterBuyer:function(){
	var registerInstance;
    web3.eth.getAccounts(function(error, accounts) {
    var account = accounts[0];

    App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;
    return registerInstance.registerBuyer({from: account});
    }).then(function(result, err){
		if(result){
            if(result.receipt.status == true)
            jQuery('#register_success').text("Hello, you are registered Successfully, your adrress is : " + account)
        }  
	});
});
},
  handleRegisterSeller:function(){
	var registerInstance;
    web3.eth.getAccounts(function(error, accounts) {
    var account = accounts[0];

    App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;
    return registerInstance.registerSeller({from: account});
    }).then(function(result, err){
		if(result){
            if(result.receipt.status == true)
            jQuery('#register_success').text("Hello, you are registered Successfully, your adrress is : " + account)
        }  
	});
});
},


  handleTotalItems:function(){
	var registerInstance;
    web3.eth.getAccounts(function(error, accounts) {
    var account = accounts[0];

    App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;
	registerInstance.checknNoOfItems({from: account}).then((result)=>{

		jQuery('#gettotalItems').text("Total Available Items : " + result.toString())
	})
});
});

  },
  handleProducts:function(){


	var registerInstance;
	web3.eth.getAccounts(function(error, accounts) {
	var account = accounts[0];
	App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;

	return registerInstance.seeProductsInfo({from: account}).then((result)=>{
		x = result;
		console.log(x, result.length);
		result.forEach((ele, i)=>{
			console.log("hi-ds")

			jQuery('#getproducts').append("<i > Present Products : </i> " , "<br></br>");
			jQuery('#getproducts').append("Product Id: ", result[i].prodID.toString())
			jQuery('#getproducts').append("<br></br>")
			jQuery('#getproducts').append("Product owners ", result[i].owners.toString())
			jQuery('#getproducts').append("<br></br>")
			jQuery('#getproducts').append("Description of Product: ", result[i].description.toString())
			jQuery('#getproducts').append("<br></br>")
			jQuery('#getproducts').append("price of Product: ", result[i].price.toString())
			jQuery('#getproducts').append("<br></br>")
			console.log(image)
			if(parseInt(result[i].prodID, 10) in image){
				const data = document.createElement('img')
				console.log("hi")
				console.log(image, result[i].prodID)
				data.src = image[parseInt(result[i].prodID, 10)];
				data.width = "400"
				data.height = "400"
				console.log(data)
				jQuery("#getproducts").append(data)	
			}
		})
		
	})

});
});

  },

  handleTransferredProducts:function(){
	var registerInstance;
	web3.eth.getAccounts(function(error, accounts) {
	var account = accounts[0];
	App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;

	return registerInstance.checkTransferredProducts({from: account}).then((result)=>{
		x = result;
		console.log(x);
		for (var i = 0; i < result.length; i++) {
			
			jQuery('#gettransferredproducts').append("<i > Transferred Products : </i> " , "<br></br>");
			jQuery('#gettransferredproducts').append("<i > Products bought by  : </i> " , result[i].boughtby.toString(),"<br></br>");
			jQuery('#gettransferredproducts').append("<i > Transferred Products Review: </i> " , result[i].review.toString(),"<br></br>");
			

			jQuery('#gettransferredproducts').append("<br></br>")
		}
		
	})

});
});
  },
  handleBuyerBalance:function(){
	var registerInstance;
	web3.eth.getAccounts(function(error, accounts) {
	var account = accounts[0];
	App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;

	return registerInstance.checkBalance({from: account}).then((result)=>{
		jQuery('#getbuyerbalance').append("<i > Buyer Balance : </i>" , result.toString());
		
	})

});
});
},



  handlebuy:function(val, adress){

	var registerInstance;
	web3.eth.getAccounts(function(error, accounts) {
	var account = accounts[0];
	App.contracts.BI.deployed().then(function(instance) {
	registerInstance = instance;
	console.log(x)
	let price = 0;
	for (var i = 0; i < x.length; ++i) {
		if(x[i].prodID == val) {
			price = x[i].price;
			break;
		}
	}
	console.log(price);
	return registerInstance.buyProducts(val, adress, {from: account, value: web3.utils.toWei(price.toString(), "ether")}).then((result)=>{
		
		console.log(result)
		
		if(result){
            if(result.receipt.status == true){
            alert("Item Bought Successfully")
			}
        }  
	})

});
});

  
  },
  handlesell:function(id, owner, cost, desc){
	  var x = document.getElementById("url").value;
	  image[id] = x;
	  localStorage.setItem("image", JSON.stringify(image))
	  var registerInstance;
	  web3.eth.getAccounts(function(error, accounts) {
	  var account = accounts[0];
	  App.contracts.BI.deployed().then(function(instance) {
	  registerInstance = instance;
			
	  return registerInstance.fillProductInfo(id, owner, cost, desc, {from: account}).then((result)=>{
		if(result){
            if(result.receipt.status == true){
            alert("Item Added Successfully")
			}
        }  
		  
	  })
  
  });
  });
  },

}


$(function() {
  $(window).load(function() {
    App.init();
  });

});