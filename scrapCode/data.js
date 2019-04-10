var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [{
                    x: new Date(),
                    y: 4
                }, {
                    t: new Date(),
                    y: 10
                }]
        }]
    },

    // Configuration options go here
    options: {

    }
});





// Helper function to extract the date from a dateTime
var date = function(d){
    return moment(d.dateTime).format('YYYY-MM-DD');
}

// map a group to the required form
var groupToSummary = function(group, date) {
    return {
        date: date,
        data: group
    }
}

var IWANT = _(IHAVE)
    .groupBy(date)
    .map(groupToSummary)
    .value();
    
    
    var datasets = [{
  label: 'google',
  backgroundColor: "rgba(196, 93, 105, 0.3)",
  showLine: true,
  data: [
    {x: 04/01/2019. y:3}, {...}, {...}
  ]
}, {
  label: 'facebook',
  backgroundColor: "rgba(196, 93, 105, 0.3)",
  showLine: true,
  data: [
    {x: 04/01/2019. y:3}, {...}, {...}
  ]
}]