export const initialClans = [
    { id: 1, name: "La Horda de Hierro", faction: "Horde", description: "Clan enfocado en raids míticas de alto nivel.", banner: "https://via.placeholder.com/300x100?text=Horda+de+Hierro" },
    { id: 2, name: "Alianza del Viento", faction: "Alliance", description: "Gremio casual PvE y raid táctica.", banner: "https://via.placeholder.com/300x100?text=Alianza+del+Viento" },
    { id: 3, name: "Mercenarios Neutros", faction: "Neutral", description: "Jugadores libres para contratar en raids de cualquier facción.", banner: "https://via.placeholder.com/300x100?text=Mercenarios" },
  ];
  
  export const initialUsers = [
    { id: 1, gamertag: "TankCommander", class: "Tank", region: "SA", level: 100, role: "Raid Leader", reliability: 100, clanId: 1 },
    { id: 2, gamertag: "IronShield", class: "Tank", region: "NA", level: 98, role: "Officer", reliability: 95, clanId: 1 },
    { id: 3, gamertag: "AegisWall", class: "Tank", region: "EU", level: 90, role: "Raider", reliability: 85, clanId: 2 },
    { id: 4, gamertag: "HolyPriest", class: "Healer", region: "SA", level: 95, role: "Officer", reliability: 90, clanId: 1 },
    { id: 5, gamertag: "LifeBloom", class: "Healer", region: "NA", level: 92, role: "Raider", reliability: 88, clanId: 2 },
    { id: 6, gamertag: "DivineLight", class: "Healer", region: "SA", level: 85, role: "Raider", reliability: 80, clanId: 3 },
    { id: 7, gamertag: "MistWeaver", class: "Healer", region: "NA", level: 78, role: "Bench", reliability: 65, clanId: 1 },
    { id: 8, gamertag: "FireMage", class: "DPS", region: "SA", level: 99, role: "Raider", reliability: 92, clanId: 1 },
    { id: 9, gamertag: "ShadowBlade", class: "DPS", region: "NA", level: 91, role: "Raider", reliability: 86, clanId: 2 },
    { id: 10, gamertag: "FrostSniper", class: "DPS", region: "SA", level: 89, role: "Bench", reliability: 60, clanId: 3 },
    { id: 11, gamertag: "BuffMaster", class: "Support", region: "NA", level: 94, role: "Officer", reliability: 95, clanId: 2 },
    { id: 12, gamertag: "AuraProvider", class: "Support", region: "SA", level: 82, role: "Raider", reliability: 75, clanId: 3 }
  ];
  
  export const initialRaids = [
    { id: 101, name: "Naxxramas Core", difficulty: "Mythic", state: "Planning", startTime: "2026-09-01T20:00:00Z", durationHours: 3, minPlayers: 10, maxPlayers: 20, clanId: 1, requiredRoles: { Tank: 1, Healer: 1, DPS: 1 } },
    { id: 102, name: "Molten Caverns", difficulty: "Heroic", state: "Planning", startTime: "2026-09-02T18:00:00Z", durationHours: 2, minPlayers: 10, maxPlayers: 15, clanId: 1, requiredRoles: { Tank: 1, Healer: 2 } },
    { id: 103, name: "Ulduar Keep", difficulty: "Mythic", state: "Locked", startTime: "2026-09-03T19:00:00Z", durationHours: 4, minPlayers: 10, maxPlayers: 25, clanId: 1, requiredRoles: { Tank: 2, Healer: 1, DPS: 1 } },
    { id: 104, name: "Black Temple", difficulty: "Heroic", state: "Locked", startTime: "2026-09-04T21:00:00Z", durationHours: 3, minPlayers: 10, maxPlayers: 20, clanId: 2, requiredRoles: { Tank: 1, Healer: 1, DPS: 1, Support: 1 } },
    { id: 105, name: "Icecrown Citadel", difficulty: "Impossible", state: "Locked", startTime: "2026-09-05T22:00:00Z", durationHours: 5, minPlayers: 10, maxPlayers: 30, clanId: 2, requiredRoles: { Tank: 1, Healer: 1, Support: 1 } },
    { id: 106, name: "Onyxia Lair", difficulty: "Normal", state: "InProgress", startTime: "2026-08-27T17:00:00Z", durationHours: 2, minPlayers: 10, maxPlayers: 15, clanId: 1, requiredRoles: { Tank: 1, Healer: 1, DPS: 1 } },
    { id: 107, name: "Serpentshrine Cavern", difficulty: "Heroic", state: "InProgress", startTime: "2026-08-27T16:00:00Z", durationHours: 3, minPlayers: 10, maxPlayers: 20, clanId: 3, requiredRoles: { Healer: 1, DPS: 1, Support: 1 } },
    { id: 108, name: "Sunwell Plateau", difficulty: "Mythic", state: "Completed", startTime: "2026-08-20T20:00:00Z", durationHours: 4, minPlayers: 10, maxPlayers: 25, clanId: 1, requiredRoles: { Tank: 2, Healer: 2, DPS: 1 } },
  ];
  
  export const initialFailures = Array.from({ length: 35 }, (_, index) => ({
    id: index + 1,
    userId: (index % 12) + 1,
    raidId: 108,
    type: ["Failed mechanic", "Interrupted wrong target", "Pulled early", "Broke CC", "Wrong positioning", "AFK during pull"][index % 6],
    severity: [1, 3, 5][index % 3]
  }));