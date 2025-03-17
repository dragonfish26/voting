const socket = io(); 

socket.emit("newConnection");
socket.emit("votantConnected");

/*
socket.emit("testMessage", "Hello from votant!"); 

socket.on("message", (data) => {
    console.log("Message from server:", data);
});*/

let voteChartInstance = null;


const voteStatus = document.getElementById("vote-status");
const voteOptions = document.getElementById("vote-options");
const voteResult = document.getElementById("vote-result");

const pourBtn = document.getElementById("pour");
const contreBtn = document.getElementById("contre");
const nppvBtn = document.getElementById("nppv");
const abstentionBtn = document.getElementById("abstention");

const resultSection = document.getElementById('results-section');

//voter connects
socket.emit("votantConnected"); 


socket.on("voteStarted", (voteName) => {
  voteStatus.innerText = `Vote is open: ${voteName}`;
  voteOptions.style.display = "block";  
  resultSection.style.display = 'none';
  voteResult.style.display = 'none';
});


socket.on("voteClosed", (voteData) => {

  voteStatus.innerText = `Vote closed. Results:`;
  voteOptions.style.display = "none"; 

  resultSection.style.display = 'block';

  // Clear the canvas before creating a new chart
  if (voteChartInstance) {
    voteChartInstance.destroy();
    voteChartInstance = null;
  }

  // Clear the canvas element
  const ctxVoter = document.getElementById('votantChart').getContext('2d');
  ctxVoter.clearRect(0, 0, ctxVoter.canvas.width, ctxVoter.canvas.height);  

  //total votes
  const totalVotes = voteData.votes.pour + voteData.votes.contre + voteData.votes.nppv + voteData.votes.abstention;

  // create the new chart
  voteChartInstance = new Chart(ctxVoter, {
      type: 'bar',
      data: {
          labels: ['Pour', 'Contre', 'NPPV', 'Abstention'],
          datasets: [{
              label: `Result for ${voteData.name}`,
              data: [
                  voteData.votes.pour,
                  voteData.votes.contre,
                  voteData.votes.nppv,
                  voteData.votes.abstention
              ],
              backgroundColor: '#DDA15E',
              borderColor: '#BC6C25',
              borderWidth: 1
          }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            suggestedMax: Math.max(10, totalVotes)
          }
        }
      }
  });
});



socket.on("error", (data) => {
  alert(data.message);
});


function castVote(voteOption) {
  socket.emit("castVote", voteOption);
  voteResult.style.display = 'block';
  voteResult.innerText = `You have voted: ${voteOption}`;
}

pourBtn.addEventListener("click", () => castVote("pour"));
contreBtn.addEventListener("click", () => castVote("contre"));
nppvBtn.addEventListener("click", () => castVote("nppv"));
abstentionBtn.addEventListener("click", () => castVote("abstention"));