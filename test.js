import stringWidth from 'string-width';

` Player Activity ──────────────────────────────────╮ Server Statistics ────────────────────╮ Game Events ──────────────────────────╮
│                                                  ││                                      ││                                      │
│ 🎮 StormBreaker won duel░░░░░░░░░░░░             ││ 🖥️ Server Status: ONLINE░           ││ 👨‍💼 Admin: Please report...        │
│ 🔴 StormBreaker left the server░░░░░             ││ 👥 Players: 5/16░░░░░░░░░░           ││                                      │
│ 🎮 DarkPhoenix completed quest░░░░░░             ││ 🏆 Active Matches: 3░░░░░░           ││                                      │
│ ⭐ ShadowNinja leveled up to leve...             ││ ⚔️ Total Kills: 0░░░░░░░░           ││                                      │
│ 🎮 DarkPhoenix bought upgrade░░░░░░░             ││ 📈 XP Awarded: 1,191░░░░░░           ││                                      │
│ 🎮 DarkPhoenix bought upgrade░░░░░░░             ││ 🛒 Items Traded: 3░░░░░░░░           ││                                      │
│ 🔴 DragonSlayer left the server░░░░░             ││ 📝 Quests Done: 1░░░░░░░░░           ││                                      │
│ ⭐ ShadowNinja leveled up to leve...             ││ ⏱️ Uptime: 0h 0m░░░░░░░░░           ││                                      │
│ 🎮 ShadowNinja won duel░░░░░░░░░░░░░             ││ 📡 Ping: 22ms░░░░░░░░░░░░░           ││                                      │
│ 🔴 IronWolf left the server░░░░░░░░░             ││ 💾 Memory: 82%░░░░░░░░░░░░           ││                                      │
│ 🎮 ShadowNinja sold item░░░░░░░░░░░░             ││                                      ││                                      │
│ ⚔️ ShadowNinja killed GhostRider░░░             ││                                      ││                                      │
│ 🎮 GhostRider sold item░░░░░░░░░░░░░             ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
│                                                  ││                                      ││                                      │
╰──────────────────────────────────────────────────╯╰──────────────────────────────────────╯╰──────────────────────────────────────╯`
  .split('\n')
.forEach(line => console.log(stringWidth(line)))

console.log(`│ 🖥️  - ${stringWidth(`│ 🖥️ Server Status: ONLINE`)}`)
console.log(`│ 👥  - ${stringWidth(`│ 👥 Players: 5/16░░░░░░░░`)}`)