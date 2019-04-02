console.log('Client-side code running');

var buttons = document.getElementsByClassName("myButton");


// Listen to when a user clicks any button, then fetch a
// post request to the servercd

for(var i=0; i < buttons.length; i++){
buttons[i].addEventListener('click', function(e) {
  console.log('button was clicked');

  fetch('/:username/clicked', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('click was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log("This is the error:",error);
    });
});
}

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
