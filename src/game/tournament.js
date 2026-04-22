import { CHARACTERS } from './characters.js';

export function createTournament(playerCharId, difficulty = 1) {
  const allCharIds = Object.keys(CHARACTERS).filter(id => id !== playerCharId);

  // Seed the tournament with 8 opponents for 4 rounds
  const opponents = [];
  for (let i = 0; i < 8; i++) {
    const idx = Math.floor(Math.random() * allCharIds.length);
    opponents.push(allCharIds[idx]);
  }

  return {
    playerChar: playerCharId,
    round: 1,
    maxRounds: 4,
    matchesWon: 0,
    opponents,
    currentOpponentIndex: 0,
    bracket: generateBracket(playerCharId, opponents),
    difficulty: difficulty || 1,
    winner: null
  };
}

export function generateBracket(playerChar, opponents) {
  // Single elimination bracket
  const bracket = {
    round1: [
      { player: playerChar, opponent: opponents[0], winner: null },
      { player: playerChar, opponent: opponents[1], winner: null },
      { player: playerChar, opponent: opponents[2], winner: null },
      { player: playerChar, opponent: opponents[3], winner: null }
    ],
    round2: [
      { player: null, opponent: null, winner: null },
      { player: null, opponent: null, winner: null }
    ],
    round3: [
      { player: null, opponent: null, winner: null }
    ],
    round4: [
      { player: null, opponent: null, winner: null }
    ]
  };
  return bracket;
}

export function getTournamentState(tournament) {
  const { bracket, round, matchesWon } = tournament;
  const rounds = ['round1', 'round2', 'round3', 'round4'];
  const currentRound = rounds[round - 1];
  const currentMatch = bracket[currentRound][Math.floor(matchesWon % Math.pow(2, 4 - round))];

  return {
    currentMatch,
    currentRound,
    round,
    matchesWon,
    nextOpponent: currentMatch?.opponent,
    isChampion: round > 4
  };
}

export function advanceTournament(tournament, winner) {
  tournament.matchesWon += 1;

  const { bracket, round } = tournament;
  const rounds = ['round1', 'round2', 'round3', 'round4'];
  const currentRound = rounds[round - 1];
  const matchIdx = Math.floor((tournament.matchesWon - 1) % Math.pow(2, 4 - round));

  // Record the winner
  bracket[currentRound][matchIdx].winner = winner;

  // Check if round is complete
  const roundMatches = bracket[currentRound].length;
  if (tournament.matchesWon % roundMatches === 0) {
    // Move to next round
    if (round < 4) {
      tournament.round += 1;
      advanceRound(tournament, winner);
    } else if (round === 4) {
      // Tournament complete
      tournament.winner = winner;
    }
  }

  return tournament;
}

function advanceRound(tournament, winner) {
  const { bracket, round, matchesWon } = tournament;
  const rounds = ['round1', 'round2', 'round3', 'round4'];

  // Seed next round with bracket winners
  const currentRound = rounds[round - 2];
  const nextRound = rounds[round - 1];

  // Find which match in current round this winner came from
  const currentMatches = bracket[currentRound];
  let nextMatchIdx = 0;

  // Pair up winners for next round
  for (let i = 0; i < currentMatches.length; i += 2) {
    const match1Winner = currentMatches[i]?.winner;
    const match2Winner = currentMatches[i + 1]?.winner;

    if (match1Winner && match2Winner && nextMatchIdx < bracket[nextRound].length) {
      bracket[nextRound][nextMatchIdx].player = match1Winner;
      bracket[nextRound][nextMatchIdx].opponent = match2Winner;
      nextMatchIdx++;
    }
  }
}

export function getDifficultyMultiplier(round) {
  const multipliers = { 1: 1.0, 2: 1.3, 3: 1.6, 4: 2.0 };
  return multipliers[round] || 1.0;
}
