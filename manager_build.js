var buildManager = {
    run: function(home) {
        //container building
        
        const sources = home.find(FIND_SOURCES);
        
        for (const source of sources) {
            const adjacentPositions = this.getAdjacentPositions(source.pos);

            if (home.controller.level < 2) {

                const emptyPositions = adjacentPositions.filter(pos => pos.lookFor(LOOK_STRUCTURES).length === 0 && pos.lookFor(LOOK_CONSTRUCTION_SITES).length === 0);
                if (emptyPositions.length === 0) continue;


                const result = emptyPositions[0].createConstructionSite(STRUCTURE_CONTAINER);

                if (result === OK) {
                    console.log('Placed container at source (${source.pos.x},${source.pos.y})')
                } else {
                }
            }
        }
        
    const spawn = home.find(FIND_MY_SPAWNS)[0];
if (!spawn) {
  home.memory.spawnpos.createConstructionSite(STRUCTURE_SPAWN)
}

const spawnX = spawn.pos.x;
const spawnY = spawn.pos.y;
const spawnPos = new RoomPosition(spawnX, spawnY, home.name);

for (let x = spawnX - 1; x <= spawnX + 1; x++) {
    for (let y = spawnY - 1; y <= spawnY + 1; y++) {
        if (x !== spawnX || y !== spawnY) {
            const pos = new RoomPosition(x, y, home.name);
            if (pos.lookFor(LOOK_TERRAIN) !== "wall") {
                pos.createConstructionSite(STRUCTURE_ROAD);
            }
        }
    }
}
        if (home.controller.level >= 4) {
            const storage = home.storage;
            if (!storage) {
                const roadTiles = spawnPos.getAdjacentPositions().filter(pos => {
                    const structures = pos.lookFor(LOOK_STRUCTURES);
                    return structures.length > 0 && structures[0].structureType === STRUCTURE_ROAD;
                });

                if (roadTiles.length > 0) {
                    const result = roadTiles[0].destroy();
                    if (result === OK) {
                        console.log('Destroyed road next to spawn');

                        // Build a storage in its place
                        const result = roadTiles[0].createConstructionSite(STRUCTURE_STORAGE);
                        if (result === OK) {
                            console.log('Started construction of storage');
                        }
                    }
                }
            }
        }

        // Place diagonal roads in a "V" shape around the spawn
        spawnPos
  .findInRange(FIND_MY_CONSTRUCTION_SITES, 1, {
      filter: { structureType: STRUCTURE_ROAD }
  })
  .forEach(site => {
      const dx = site.pos.x - spawnX;
      const dy = site.pos.y - spawnY;
      const p1 = new RoomPosition(spawnX + dy, spawnY + dx, home.name);
      const p2 = new RoomPosition(spawnX - dy, spawnY - dx, home.name);

      if (p1.lookFor(LOOK_TERRAIN) !== "wall") {
          p1.createConstructionSite(STRUCTURE_ROAD);
      }

      if (p2.lookFor(LOOK_TERRAIN) !== "wall") {
          p2.createConstructionSite(STRUCTURE_ROAD);
      }
  });

const numCircles = 3; // change this to change the number of circles
const radiusStep = 2; // change this to change the distance between circles
const angleStep = Math.PI / 8;
const minDistance = 1; // change this to change the minimum distance from spawn

const extensionPositions = [];

for (let i = 0; i < numCircles; i++) {
  const radius = (i + 1) * radiusStep;
  
  for (let angle = 0; angle < 2 * Math.PI; angle += angleStep) {
    const x = spawnX + Math.floor(Math.cos(angle) * radius);
    const y = spawnY + Math.floor(Math.sin(angle) * radius);
    const position = new RoomPosition(x, y, home.name);

    if (position.getRangeTo(spawnPos) >= minDistance) {
      const constructionSites = position.lookFor(LOOK_CONSTRUCTION_SITES);
      if (constructionSites.length === 0) {
        const result = position.createConstructionSite(STRUCTURE_EXTENSION);
        if (result === OK) {
          console.log(`Placed extension at position (${x},${y})`);
          extensionPositions.push(position);
        }
      }
    }
  }
}

const numExtensions = extensionPositions.length;
if (numExtensions === 0) return;

const centerPosition = new RoomPosition(spawnX, spawnY, home.name);
const closestExtension = centerPosition.findClosestByRange(extensionPositions);

const sortedExtensions = [closestExtension];
extensionPositions.splice(extensionPositions.indexOf(closestExtension), 1);

while (extensionPositions.length > 0) {
  const lastExtension = sortedExtensions[sortedExtensions.length - 1];
  const closestExtension = lastExtension.findClosestByRange(extensionPositions);
  sortedExtensions.push(closestExtension);
  extensionPositions.splice(extensionPositions.indexOf(closestExtension), 1);
}

for (const position of sortedExtensions) {
  const result = position.createConstructionSite(STRUCTURE_EXTENSION);
  if (result === OK) {
    console.log(`Placed extension at position (${position.x},${position.y})`);
  }
}
    },
    getAdjacentPositions: function (pos) {
        const positions = [];
        const terrain = new Room.Terrain(pos.roomName);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const x = pos.x + dx;
                const y = pos.y + dy;
                if (x < 0 || y < 0 || x > 49 || y > 49) continue;
                // Check if the position is in front of the source and not blocked by a wall
                if ((dx === 0 && Math.abs(dy) === 1) || (dy === 0 && Math.abs(dx) === 1)) {
                    const terrainType = terrain.get(x, y);
                    if (terrainType === TERRAIN_MASK_WALL) continue;
                    const newPos = new RoomPosition(x, y, pos.roomName);
                    positions.push(newPos);
                }
            }
        }
        return positions;
    },
}

module.exports = buildManager;