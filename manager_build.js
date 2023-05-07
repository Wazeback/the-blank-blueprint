var buildManager = {
    run: function(home) {
        const terrain = home.getTerrain();
        const sources = home.find(FIND_SOURCES);

        for (const source of sources) {
            const adjacentPositions = this.getAdjacentPositions(source.pos);

            if (home.controller.level < 2) {

                const emptyPositions = adjacentPositions.filter(pos => pos.lookFor(LOOK_STRUCTURES).length === 0 && pos.lookFor(LOOK_CONSTRUCTION_SITES).length === 0);
                if (emptyPositions.length === 0) continue;

                const pos = emptyPositions[0];
                const structures = pos.lookFor(LOOK_STRUCTURES);
                if (structures.length > 0) {
                    const result = structures[0].destroy();
                    if (result !== OK) continue;
                }

                const result = pos.createConstructionSite(STRUCTURE_CONTAINER);

                if (result === OK) {
                    console.log(`Placed container at source (${source.pos.x},${source.pos.y})`);
                } else {
                    console.log(`Failed to place container at source (${source.pos.x},${source.pos.y}): ${result}`);
                }
            }
        }

        const spawn = home.find(FIND_MY_SPAWNS)[0];
        if (!spawn) {
            home.memory.spawnpos.createConstructionSite(STRUCTURE_SPAWN);
        }

        const spawnX = spawn.pos.x;
        const spawnY = spawn.pos.y;
        const spawnPos = new RoomPosition(spawnX, spawnY, home.name);

        for (let x = spawnX - 1; x <= spawnX + 1; x++) {
            for (let y = spawnY - 1; y <= spawnY + 1; y++) {
                if (x !== spawnX || y !== spawnY) {
                    const pos = new RoomPosition(x, y, home.name);                
                    // Check if the position is not a wall and does not have any structures
                    if (terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL && pos.lookFor(LOOK_STRUCTURES).length === 0) {
                        pos.createConstructionSite(STRUCTURE_ROAD);
                    }
                }
            }
        }


        if (home.controller.level >= 4 && !STRUCTURE_STORAGE) {
            const room = spawn.room;
            const spawnPos = spawn.pos;
            const walls = STRUCTURE_WALL;
            const x = spawnPos.x;
            const y = spawnPos.y;
            let storagePos;

            for (let dx = -2; dx <= 2; dx++) {
                for (let dy = -2; dy <= 2; dy++) {
                    const newX = x + dx;
                    const newY = y + dy;
                    if (terrain.get(newX, newY) !== walls) {
                        const pos = new RoomPosition(newX, newY, room.name);
                        const structures = pos.lookFor(LOOK_STRUCTURES);
                        const hasObstacle = structures.some(structure => structure.structureType !== STRUCTURE_ROAD && structure.structureType !== STRUCTURE_STORAGE);
                        if (!hasObstacle) {
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
                } else {
                    console.log(`Failed to create storage at ${storagePos}: ${result}`);
                }
            } else {
                console.log('Could not find a suitable location for storage near spawn');
            }
        }
        spawnPos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1, {
            filter: { structureType: STRUCTURE_ROAD }
        })
        .forEach(site => {
            const dx = site.pos.x - spawnX;
            const dy = site.pos.y - spawnY;
            const p1 = new RoomPosition(spawnX + dy, spawnY + dx, home.name);
            const p2 = new RoomPosition(spawnX - dy, spawnY - dx, home.name);
            if (terrain.get(p1.x, p1.y) !== TERRAIN_MASK_WALL && p1.lookFor(LOOK_STRUCTURES).length === 0) {
                p1.createConstructionSite(STRUCTURE_ROAD);
            }

            if (terrain.get(p2.x, p2.y) !== TERRAIN_MASK_WALL && p2.lookFor(LOOK_STRUCTURES).length === 0) {
                p2.createConstructionSite(STRUCTURE_ROAD);
            }
        });

        if (home.controller.level >= 2) {
            const room = spawn.room;
            const sources = room.find(FIND_SOURCES);
            const spawnPos = spawn.pos;
            const spawnX = spawnPos.x;
            const spawnY = spawnPos.y;

            // construct roads towards the sources
            sources.forEach(source => {
                const path = room.findPath(spawnPos, source.pos, { ignoreCreeps: true });
                path.forEach(step => {
                    const x = step.x;
                    const y = step.y;
                    const pos = new RoomPosition(x, y, room.name);
                    if (terrain.get(x, y) !== TERRAIN_MASK_WALL && pos.lookFor(LOOK_STRUCTURES).length === 0) {
                        pos.createConstructionSite(STRUCTURE_ROAD);
                    }
                });
            });
        }

        const numCircles = 3; // change this to change the number of circles
        const radiusStep = 2; // change this to change the distance between circles
        const angleStep = Math.PI / 10;
        const minDistance = 2; // change this to change the minimum distance from spawn

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