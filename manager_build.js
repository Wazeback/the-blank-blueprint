
var buildManager = {
    run: function(home) {
        const terrain = home.getTerrain();
        const sources = home.find(FIND_SOURCES);
        this.placeStorage(home, terrain);
        this.placeRoadsToSource(home, terrain, sources);
        this.placeExtensions(home, terrain); 
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
    placeRoadsToSource: function(home, terrain, sources) {
        if (home.memory.buildStatus.SatusplaceRoadsToSource || home.controller.level < 3) return;
        const spawnPos = new RoomPosition(home.memory.spawnpos.x,home.memory.spawnpos.y,home.memory.spawnpos.roomName );

        // construct roads towards the sources
        sources.forEach(source => {
            const path = home.findPath(spawnPos, source.pos, { ignoreCreeps: true });
            path.forEach(step => {
                const x = step.x;
                const y = step.y;
                const pos = new RoomPosition(x, y, home.name);
                if (terrain.get(x, y) !== TERRAIN_MASK_WALL && pos.lookFor(LOOK_STRUCTURES).length === 0) {
                    pos.createConstructionSite(STRUCTURE_ROAD);
                }
            });
        });
        home.memory.buildStatus.SatusplaceRoadsToSource = true;
    },
    placeStorage: function(home, terrain) {
        if (home.memory.buildStatus.SatusplaceStorage) return;

        const hasStorage = home.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_STORAGE }
          });
          const storageConstructionSites = home.find(FIND_CONSTRUCTION_SITES, {
            filter: { structureType: STRUCTURE_STORAGE }
        });

        const totalLength = ( hasStorage.length + storageConstructionSites.length ) > 0

        if (home.controller.level >= 4 && !totalLength) {
            const spawnPos = new RoomPosition(home.memory.spawnpos.x,home.memory.spawnpos.y,home.memory.spawnpos.roomName);
            const walls = STRUCTURE_WALL;
            const x = spawnPos.x;
            const y = spawnPos.y;
            let storagePos;

            for (let dx = -2; dx <= 2; dx++) {
                for (let dy = -2; dy <= 2; dy++) {
                    const newX = x + dx;
                    const newY = y + dy;
                    if (terrain.get(newX, newY) !== walls) {
                        const pos = new RoomPosition(newX, newY, home.name);
                        const structures = pos.lookFor(LOOK_STRUCTURES);
                        const hasObstacle = structures.some(structure => structure.structureType !== STRUCTURE_ROAD && structure.structureType !== STRUCTURE_STORAGE);
                        const range = 0; // set the range to 1 to check the specified position and the 8 adjacent positions
                        const constructionSites = pos.findInRange(FIND_CONSTRUCTION_SITES, range);
                        const roads = pos.lookFor(LOOK_STRUCTURES).filter(structure => structure.structureType === STRUCTURE_ROAD);
                        if (!hasObstacle && constructionSites.length === 0 && roads.length == 0) {
                            storagePos = pos;
                            break;
                        }
                    }
                }
                if (storagePos) {
                    break;
                }
            }


            if (storagePos) {
                const result = storagePos.createConstructionSite(STRUCTURE_STORAGE);
                if (result === OK) {
                    
                    console.log(`Created storage at ${storagePos}`);
                    return;
                } else {
                    console.log(storagePos.lookFor(LOOK_STRUCTURES));
                    console.log(storagePos.lookFor(LOOK_CONSTRUCTION_SITES));
                    console.log(Object.keys(Game.constructionSites).length);

                    console.log(`Failed to create storage at ${storagePos}: ${result}`);
                }
                home.memory.buildStatus.SatusplaceStorage = true;
            } else {
                console.log('Could not find a suitable location for storage near spawn');
            }
        }
    },
    placeExtensions: function(home, terrain) {
        if(home.memory.buildStatus.StatusPlaceExtensions) return;
        const spawnPos = new RoomPosition(home.memory.spawnpos.x,home.memory.spawnpos.y,home.memory.spawnpos.roomName );
        const spawnX = spawnPos.x
        const spawnY = spawnPos.y
        const numCircles = 3; // change this to change the number of circles
        const radiusStep = 2; // change this to change the distance between circles
        const angleStep = Math.PI / 6;
        const minDistance = 3; // change this to change the minimum distance from spawn

        const extensionPositions = [];

        for (let i = 0; i < numCircles; i++) {
            const radius = (i + 1) * radiusStep;
            
            for (let angle = 0; angle < 2 * Math.PI; angle += angleStep) {
                const x = spawnX + Math.floor(Math.cos(angle) * radius);
                const y = spawnY + Math.floor(Math.sin(angle) * radius);
                const position = new RoomPosition(x, y, home.name);

                if (position.getRangeTo(spawnPos) >= minDistance) {
                    const constructionSites = position.lookFor(LOOK_CONSTRUCTION_SITES);
                    if (constructionSites.length === 0 && terrain.get(x, y) != TERRAIN_MASK_WALL) {
                        const result = position.createConstructionSite(STRUCTURE_EXTENSION);
                        if (result === OK) {
                            console.log(`Placed extension at position (${x},${y})`);
                            extensionPositions.push(position);
                        }
                    }
                }
            }
        }
        home.memory.buildStatus.StatusPlaceExtensions = true;
    },
}

module.exports = buildManager;