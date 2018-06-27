// // client-side js
// // run by the browser each time your view template referencing it is loaded
// (function(){
//   console.log('hello world :o');
//     // code from the next step will go here

//   let transfers = [];
  
//   // define variables that reference elements on our page
//   const transfersList = document.getElementById('transfers');
//   const transfersForm = document.forms[0];
//   const transferInput = transfersForm.elements['transfer'];
  
//   // a helper function to call when our request for transfers is done
//   const getTransfersListener = function() {
//     // parse our response to convert to JSON
//     transfers = JSON.parse(this.responseText);
    
//     // iterate through every transfer and add it to our page
//     transfers.forEach( function(row) {
//       appendNewTransfer(row.transfer);
//     });
//   }

//   // request sthe transfers from our app's sqlite database
//   const transferRequest = new XMLHttpRequest();
//   transferRequest.onload = getTransfersListener;
//   transferRequest.open('get', '/getTransfers');
//   transferRequest.send();
  
//   // a helper function that creates a list item for a given transfer
//   const appendNewTransfer= function(transfer) {
//     const newListItem = document.createElement('li');
//     newListItem.innerHTML = transfer;
//     transfersList.appendChild(newListItem);
//   }
  
//   // listen for the form to be submitted and add a new transfer when it is
//   transfersForm.onsubmit = function(event) {
//     // stop our form submission from refreshing the page
//     event.preventDefault();
    
//     // get transfer value and add it to the list
//     transfers.push(transferInput.value);
//     appendNewTransfer(transferInput.value);
  
//     // reset form 
//     transferInput.value = '';
//     transferInput.focus();
//   };
  

// })()