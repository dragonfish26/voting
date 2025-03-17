export default class IOController {
    #io;
    #adminSocket = null; 
    #votes = {}; 
    #previousVotes = new Map();

    #totalVoters = 0;  
    #connectedVoters = 0;
  
    constructor(io) {
      this.#io = io;
    }

    registerSocket(socket) {
        //console.log(`Socket connected: ${socket.id}`);
        this.setupListeners(socket);
    }

    setupListeners(socket) {

      socket.on('newConnection', () => this.handleNewConnection(socket));
      socket.on('castVote', (voteOption) => this.handleCastVote(socket, voteOption));
      socket.on('startVote', (voteName) => this.startVote(socket, voteName));
      socket.on('closeVote', () => this.closeVote(socket));
      socket.on('disconnect', () => this.handleDisconnect(socket));
    }

    // Handle a new connection, assign admin if there is none
    handleNewConnection(socket) {

      if (!this.#adminSocket) {
        this.#adminSocket = socket;
        socket.emit('adminAssigned', { message: 'You are now the admin' });
        console.log(`Admin assigned to socket ${socket.id}`);

        this.#connectedVoters = 0;
        this.#totalVoters = 0;
      } else {
        socket.emit('adminAssigned', { message: 'An admin is already active' });
        
        if (!this.#previousVotes.has(socket.id)) {
          this.#totalVoters++;  // Increment total if it's a new voter
        }
        
        //increment connected voter count
        this.#connectedVoters++;
      }

      // Send the current vote status to the new voter
      if (this.#votes.open) {
        socket.emit('voteStarted', this.#votes.name);
      }

      this.emitStats();
    }

    // Start a new vote
    startVote(socket, voteName) {
      if (this.#adminSocket !== socket) {
        socket.emit('error', { message: 'Only the admin can start a vote' });
        return;
      }

      // Reset previous votes
      this.#votes = { name: voteName, votes: { pour: 0, contre: 0, nppv: 0, abstention: 0 }, open: true };
      this.#previousVotes.clear();

      this.emitStats(); 

      // reset charts - for when restarting new votes
      this.#io.emit('resetChart', this.#votes.votes);

      // notify voters
      this.#votes = { name: voteName, votes: { pour: 0, contre: 0, nppv: 0, abstention: 0 }, open: true };
      this.#io.emit('voteStarted', voteName);
      console.log(`Vote started: ${voteName}`);
    }

    // Handle casting a vote
    handleCastVote(socket, voteOption) {
      if (!this.#votes.open) {
        socket.emit('error', { message: 'No open vote available' });
        return;
      }

      // If the voter has voted before, remove the previous vote count
      if (this.#previousVotes.has(socket.id)) {
        const oldVote = this.#previousVotes.get(socket.id);
        if (oldVote && this.#votes.votes.hasOwnProperty(oldVote)) {
            this.#votes.votes[oldVote]--;
        }
      }

      // Increment vote count based on the option
      if (this.#votes.votes.hasOwnProperty(voteOption)) {
        this.#votes.votes[voteOption]++;
        this.#previousVotes.set(socket.id, voteOption);
      } else {
        socket.emit('error', { message: 'Invalid vote option' });
        return;
      }

      // Emit updated votes to update the chart in real-time
      this.#io.emit('voteCast', { votes: this.#votes.votes });
      console.log(`Vote updated: ${voteOption} by ${socket.id}`);

      this.emitStats();

    }

    // Close the vote and send results
    closeVote(socket) {
      if (this.#adminSocket !== socket) {
        socket.emit('error', { message: 'Only the admin can close the vote' });
        return;
      }

      this.#votes.open = false;
      console.log('Vote closed event emitted', this.#votes);
      this.#io.emit('voteClosed', this.#votes);
      console.log('Vote closed, results sent to all voters');
    }

    handleDisconnect(socket) {
      if (this.#adminSocket === socket) {
        // Admin disconnected
        console.log(`Admin socket ${socket.id} disconnected`);
        this.#adminSocket = null;
        this.#io.emit('adminDisconnected', { message: 'Admin disconnected' });

      } else {
        // Voter disconnected
        console.log(`Voter socket ${socket.id} disconnected`);

        this.#connectedVoters--;  
      }

      this.emitStats();
    }


    emitStats() {
      this.#io.emit('updateStats', {
          totalVoters: this.#totalVoters,
          connectedVoters: this.#connectedVoters,
          voteCount: this.#votes.open 
              ? Object.values(this.#votes.votes).reduce((a, b) => a + b, 0) 
              : 0
      });
  }
    
  }
