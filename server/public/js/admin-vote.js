const socket = io(); 

/*
socket.emit("adminConnected");

socket.on("message", (data) => {
    console.log("Message from server:", data);
});

socket.emit("testMessage", "Hello from admin!"); 
}); */


socket.emit("newConnection");

const startVoteBtn = document.getElementById('start-vote-btn');
const closeVoteBtn = document.getElementById('close-vote-btn');
const voteTextInput = document.getElementById('vote-text');
const voteTextSection = document.getElementById('vote-text-section');
const currentVoteName = document.getElementById('current-vote-name');
const infoList = document.getElementById('info-list');
const infoSection = document.getElementById('info-section');
const statsSection = document.getElementById('stats-section');
const voteStatusSection = document.getElementById('vote-status');

const resultSection = document.getElementById('results-section');
const voteCountWrapper = document.querySelector('#stats-section p:nth-child(3)');
const restartVoteBtn = document.getElementById('restart-vote');


socket.on('adminAssigned', (data) => {
  if (data.message === 'You are now the admin') {
    voteTextSection.style.display = 'block'; 
    
    closeVoteBtn.style.display = 'none'; 

    displayMessage('You are now the admin!');
  } else {
    voteTextSection.style.display = 'none';
    statsSection.style.display = 'none';
    infoSection.style.display = 'none';
    voteStatusSection.style.display = 'none';

    // admin already assigned message
    const adminMessage = document.createElement('h2');
    adminMessage.textContent = 'An admin is already assigned.';
    adminMessage.style.textAlign = 'center';
    adminMessage.style.marginTop = '20px';

    document.body.appendChild(adminMessage);
  }
});

//function to display a message in the info section
function displayMessage(message) {
  const messageElement = document.createElement('li');
  messageElement.textContent = message;
  infoList.appendChild(messageElement);
}


startVoteBtn.addEventListener('click', () => {
  const voteName = voteTextInput.value.trim();
  if (voteName) {
    socket.emit('startVote', voteName);
    currentVoteName.textContent = voteName; 
    voteTextSection.style.display = 'none'; 

    startVoteBtn.style.display = 'none';  
    closeVoteBtn.style.display = 'block';

    resultSection.style.display = 'block';
    voteCountWrapper.style.display = 'block';
    displayMessage(`Vote started: ${voteName}`);
  }
});

// Handle closing the vote
closeVoteBtn.addEventListener('click', () => {
  socket.emit('closeVote');
  displayMessage('Vote closed, results are being sent to voters.');
});


socket.on('voteStarted', (voteName) => {
  currentVoteName.textContent = voteName; 
  displayMessage(`The vote "${voteName}" is now open.`);
});

socket.on('voteClosed', (voteResults) => {
  displayMessage(`Vote closed. Final results: ${JSON.stringify(voteResults)}`);

  closeVoteBtn.style.display = 'none';   
  restartVoteBtn.style.display = 'block'; 

});

restartVoteBtn.addEventListener('click', () => {
  voteTextSection.style.display = 'block'; 

  startVoteBtn.style.display = 'block'; 
  restartVoteBtn.style.display = 'none';  

  resultSection.style.display = 'none';   
  voteCountWrapper.style.display = 'none'; 
  voteTextInput.value = '';

  //displayMessage('You can start a new vote.');
});

// updates on the stats section 
socket.on('updateStats', (stats) => {
  document.getElementById('total-voters').textContent = stats.totalVoters;
  document.getElementById('connected-voters').textContent = stats.connectedVoters;
  document.getElementById('vote-count').textContent = stats.voteCount;
});

const ctx = document.getElementById('adminChart').getContext('2d');

const adminChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Pour', 'Contre', 'NPPV', 'Abstention'],
        datasets: [{
            label: 'Votes',
            data: [0, 0, 0, 0], // Initial values
            backgroundColor: '#DDA15E',
            borderColor: '#BC6C25',
            borderWidth: 1
        }]
    },
    options: {
        indexAxis: 'y', // Makes the chart horizontal
        scales: {
            x: {
                beginAtZero: true,
                suggestedMax: 10 // Dynamically updated
            }
        }
    }
});

socket.on('voteCast', (data) => {
  console.log('Received voteCast data:', data);
  updateChart(data.votes);
});

function updateChart(voteCounts) {
  const totalVotes = voteCounts.pour + voteCounts.contre + voteCounts.nppv + voteCounts.abstention;
  
  // Update chart data
  adminChart.data.datasets[0].data = [
      voteCounts.pour, 
      voteCounts.contre, 
      voteCounts.nppv, 
      voteCounts.abstention
  ];

  // Adjust x-axis dynamically
  adminChart.options.scales.x.suggestedMax = Math.max(10, totalVotes);

  adminChart.update();
}

socket.on('resetChart', (data) => {
  console.log('Resetting chart with:', data);
  updateChart(data); 
});



