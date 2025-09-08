import Zonr from "../src";

// Gaming server monitoring demo
const zonr = new Zonr();

// Player activity feed
const playerActivity = zonr.zones.add({
  name: "Player Activity",
  width: "40%",
  height: "auto", 
  borderColor: "cyan"
});

// Server stats
const serverStats = zonr.zones.add({
  name: "Server Statistics",
  width: "30%",
  height: "auto",
  borderColor: "green"
});

// Chat/Events
const gameEvents = zonr.zones.add({
  name: "Game Events", 
  width: "30%",
  height: "auto",
  borderColor: "yellow"
});

// Match results
const matchResults = zonr.zones.add({
  name: "Recent Matches",
  width: "60%",
  height: 10,
  borderColor: "magenta"
});

// System alerts
const alerts = zonr.zones.add({
  name: "System Alerts",
  width: "40%",
  height: 10,
  borderColor: "red"
});

// Game data simulation
const playerNames = [
  'ShadowNinja', 'DragonSlayer', 'CyberKnight', 'StormBreaker', 'GhostRider',
  'IronWolf', 'DarkPhoenix', 'ThunderBolt', 'NightHawk', 'FrostBite',
  'BlazeFury', 'SteelTitan', 'VoidWalker', 'CrimsonEdge', 'SilverArrow'
];

const gameActions = [
  'joined the server', 'killed', 'was eliminated by', 'found legendary loot',
  'completed quest', 'leveled up', 'defeated boss', 'discovered secret area',
  'crafted epic weapon', 'sold item', 'bought upgrade', 'won duel'
];

const maps = ['Ancient Ruins', 'Cyber City', 'Desert Storm', 'Frozen Wasteland', 'Jungle Temple'];

let connectedPlayers = new Set();
let serverStats_data = {
  totalKills: 0,
  activeMatches: 0, 
  totalXpAwarded: 0,
  itemsTraded: 0,
  questsCompleted: 0
};

// Add some initial players
for (let i = 0; i < 8; i++) {
  const player = playerNames[i];
  connectedPlayers.add(player);
  playerActivity.info(`🟢 ${player} joined the server`);
}

const generatePlayerActivity = () => {
  const playersArray = Array.from(connectedPlayers);
  if (playersArray.length === 0) return;
  
  const player1 = playersArray[Math.floor(Math.random() * playersArray.length)];

  if (Math.random() < 0.1) {
    // Player leaves
    connectedPlayers.delete(player1);
    playerActivity.info(`🔴 ${player1} left the server`);
  } else if (Math.random() < 0.05 && connectedPlayers.size < 12) {
    // New player joins
    const availablePlayers = playerNames.filter(p => !connectedPlayers.has(p));
    if (availablePlayers.length > 0) {
      const newPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
      connectedPlayers.add(newPlayer);
      playerActivity.info(`🟢 ${newPlayer} joined the server`);
    }
  } else {
    // Regular activity
    const action = gameActions[Math.floor(Math.random() * gameActions.length)];
    
    if (action.includes('killed') || action.includes('eliminated')) {
      const player2 = playersArray[Math.floor(Math.random() * playersArray.length)];
      if (player1 !== player2) {
        playerActivity.info(`⚔️ ${player1} ${action} ${player2}`);
        serverStats_data.totalKills++;
      }
    } else if (action.includes('leveled up')) {
      const level = Math.floor(Math.random() * 50) + 1;
      playerActivity.info(`⭐ ${player1} ${action} to level ${level}`);
      serverStats_data.totalXpAwarded += Math.floor(Math.random() * 1000) + 100;
    } else {
      playerActivity.info(`🎮 ${player1} ${action}`);
      
      if (action.includes('quest')) serverStats_data.questsCompleted++;
      if (action.includes('sold') || action.includes('bought')) serverStats_data.itemsTraded++;
    }
  }
};

const generateGameEvents = () => {
  const events = [
    '🏆 Tournament starting in 5 minutes!',
    '🎁 Double XP weekend activated',
    '⚡ Server performance optimized',
    '🗺️ New map "Crystal Caverns" available', 
    '🛡️ Anti-cheat system updated',
    '💰 Daily rewards refreshed',
    '🔧 Maintenance scheduled for 2 AM',
    '📊 Season 3 leaderboard reset',
    '🎯 New achievement unlocked by community',
    '🌟 Rare item drop rate increased'
  ];
  
  if (Math.random() < 0.3) {
    const event = events[Math.floor(Math.random() * events.length)];
    gameEvents.info(event);
  }
  
  // Occasional admin messages
  if (Math.random() < 0.1) {
    gameEvents.warn('👨‍💼 Admin: Please report any bugs to our Discord');
  }
};

const generateMatchResults = () => {
  if (Math.random() < 0.4 && connectedPlayers.size >= 4) {
    const playersArray = Array.from(connectedPlayers);
    const matchPlayers = playersArray.slice(0, Math.min(4, playersArray.length));
    const winner = matchPlayers[0];
    const map = maps[Math.floor(Math.random() * maps.length)];
    const duration = `${Math.floor(Math.random() * 15) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
    const score = Math.floor(Math.random() * 25) + 10;
    
    matchResults.info(`🏅 Match Complete - ${map}`);
    matchResults.info(`   Winner: ${winner} (${score} eliminations)`);
    matchResults.info(`   Duration: ${duration} | Players: ${matchPlayers.length}`);
    
    serverStats_data.activeMatches++;
  }
};

const updateServerStats = () => {
  const uptime = Math.floor(process.uptime());
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  
  serverStats.clear();
  serverStats.info(`🖥️ Server Status: ONLINE`);
  serverStats.info(`👥 Players: ${connectedPlayers.size}/16`);
  serverStats.info(`🏆 Active Matches: ${Math.floor(Math.random() * 3) + 1}`);
  serverStats.info(`⚔️ Total Kills: ${serverStats_data.totalKills}`);
  serverStats.info(`📈 XP Awarded: ${serverStats_data.totalXpAwarded.toLocaleString()}`);
  serverStats.info(`🛒 Items Traded: ${serverStats_data.itemsTraded}`);
  serverStats.info(`📝 Quests Done: ${serverStats_data.questsCompleted}`);
  serverStats.info(`⏱️ Uptime: ${hours}h ${minutes}m`);
  serverStats.info(`📡 Ping: ${Math.floor(Math.random() * 30) + 15}ms`);
  serverStats.info(`💾 Memory: ${Math.floor(Math.random() * 20) + 65}%`);
};

const generateAlerts = () => {
  if (Math.random() < 0.15) {
    const alertTypes: { type: "info"| "warn" | "error", message: string}[] = [
      { type: 'warn', message: '⚠️ High server load detected' },
      { type: 'info', message: '🔄 Auto-scaling triggered' },
      { type: 'warn', message: '⚠️ Unusual network activity from IP' },
      { type: 'info', message: '✅ Backup completed successfully' },
      { type: 'error', message: '❌ Failed to connect to payment service' },
      { type: 'info', message: '🛡️ DDoS protection activated' }
    ];
    
    const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    alerts[alert.type](alert.message);
  }
};

// Initialize
updateServerStats();
gameEvents.info('🎮 Game server online');
gameEvents.info('🌍 Welcome to Epic Battle Royale!');
alerts.info('🔍 Monitoring systems active');

// Set up intervals
const activityInterval = setInterval(generatePlayerActivity, 1000);
const eventsInterval = setInterval(generateGameEvents, 3000);  
const matchInterval = setInterval(generateMatchResults, 8000);
const statsInterval = setInterval(updateServerStats, 2000);
const alertsInterval = setInterval(generateAlerts, 4000);

// Initial update
updateServerStats();

process.on('SIGINT', () => {
  clearInterval(activityInterval);
  clearInterval(eventsInterval);
  clearInterval(matchInterval);
  clearInterval(statsInterval);
  clearInterval(alertsInterval);
  
  gameEvents.info('🛑 Server shutting down for maintenance...');
  gameEvents.info('👋 Thanks for playing!');
  
  setTimeout(() => process.exit(0), 2000);
});

console.log('Gaming Server Demo - Press Ctrl+C to shutdown server');