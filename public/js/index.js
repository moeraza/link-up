console.log('Client-side code running');

var buttons = document.getElementsByClassName("myButton");

var username = window.location.pathname;
console.log("did this work:",username)
// Listen to when a user clicks any button, then fetch a
// post request to the servercd

// for(var i=0; i < buttons.length; i++){
// buttons[i].addEventListener('click', function(e) {
//   console.log('button was clicked');
//   console.log("Here is the clicked button:", this.innerHTML);

//   fetch("/:username/" + this.innerHTML, {method: 'POST'})
//     .then(function(response) {
//       if(response.ok) {
//         console.log('click was recorded', this.innerHTML);
//         return;
//       }
//       throw new Error('Request failed.');
//     })
//     .catch(function(error) {
//       console.log("This is the error:",error);
//     });
// });
// }

// setInterval(function() {
//   fetch('/clicks', {method: 'GET'})
//     .then(function(response) {
//       if(response.ok) return response.json();
//       throw new Error('Request failed.');
//     })
//     .then(function(data) {
//       document.getElementById('counter').innerHTML = `Button was clicked ${data.length} times`;
//     })
//     .catch(function(error) {
//       console.log(error);
//     });
// }, 1000);

// , body: JSON.stringify({nameOfClick: this.innerHTML})








// USING THE ONCLICK METHOD INSTEAD

// function myFunction(){
  
//   console.log("Here is the clicked button name:", this.innerHTML);
//     fetch('/:username/'+ this.innerHTML, {method: 'POST'})
//     .then(function(response) {
//       if(response.ok) {
//         // console.log('click was recorded', buttons[i].innerHTML);
//         return;
//       }
//       throw new Error('Request failed.');
//     })
//     .catch(function(error) {
//       console.log("This is the error:",error);
//     });
  
// }
