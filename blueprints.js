var blueprints = {
    showBuild: function (buildBlueprint, thisFlag) {
        const buildings = buildBlueprint.buildings;

        for (const buildingskey in buildings) {
            const building = buildings[buildingskey];

            for (const buildingkey in building) {
                const buildingpositions = building[buildingkey];

                for (const poskey in buildingpositions) {
                    const buildingpos = buildingpositions[poskey];
                    let color = 'red';
                    if (buildingskey == 'spawn') {
                        color = 'blue';
                    }
                    if (buildingskey == 'road') {
                        color = 'grey';
                    }
                    if (buildingskey == 'extension') {
                        color = 'yellow';
                    }

                    thisFlag.room.visual.circle(
                        thisFlag.pos.x + buildingpos.x, thisFlag.pos.y + buildingpos.y,
                    {fill: color, radius: 0.15, stroke: 'transparent'});
                }

            }

        }
    },
    build: function (buildBlueprint, thisRoom) {
        const roomLvl = thisRoom.controller.level;

        if (roomLvl != thisRoom.memory.blueprint.roomLvl) {
          const buildings = buildBlueprint.buildings;
          const markerPos = thisRoom.memory.blueprint.markerPos;
          
          for (const buildingsType in buildings) {
            const building = buildings[buildingsType];

            for (const buildingIndex in building) {
              const buildingpositions = building[buildingIndex];

              for (const posIndex in buildingpositions) {
                  const buildingpos = buildingpositions[posIndex];
                  let structureType;
                  let name = 'none';
                  const x = markerPos.x + buildingpos.x;
                  const y = markerPos.y + buildingpos.y

                  switch (buildingskey) {
                    case "spawn":
                      structureType = "STRUCTURE_SPAWN";
                      name = 'Spawn' + (Game.spawns.length + 1)
                      break;
                    case "road":
                      structureType = "STRUCTURE_ROAD";
                      break;
                    case "extension":
                      structureType = "STRUCTURE_EXTENSION";
                      break;
                    case "tower":
                      structureType = "STRUCTURE_TOWER";
                      break;
                    case "constructedWall":
                      structureType = "STRUCTURE_WALL";
                      break;
                    case "rampart":
                      structureType = "STRUCTURE_RAMPART";
                      break;
                    case "storage":
                      structureType = "STRUCTURE_STORAGE";
                      break;
                    case "observer":
                      structureType = "STRUCTURE_OBSERVER";
                      break;
                    case "terminal":
                      structureType = "STRUCTURE_TERMINAL";
                      break;
                    case "container":
                      structureType = "STRUCTURE_CONTAINER";
                      break;
                    default:
                      break;
                  }

                  const look = thisRoom.lookAt(target);
                  let blocked = false;
                  look.forEach(function(lookObject) {
                      if(lookObject.type == LOOK_STRUCTURES) {
                          
                      }
                  });

                  if (name == 'none' && blocked == false) {
                    Game.rooms.sim.createConstructionSite(x, y, structureType);
                  } else if (name != 'none' && blocked == false){
                    Game.rooms.sim.createConstructionSite(x, y, structureType, name);
                  }
                  
              }
            }
          }
        }
    },
    mainBase: {
    name: "mainBase",
    shard: "shard1",
    rcl: "8",
    buildings: {
      road: {
        pos: [
          { x: 7, y: 0 },
          { x: 6, y: 1 },
          { x: 8, y: 1 },
          { x: 5, y: 2 },
          { x: 7, y: 2 },
          { x: 9, y: 2 },
          { x: 4, y: 3 },
          { x: 7, y: 3 },
          { x: 10, y: 3 },
          { x: 3, y: 4 },
          { x: 6, y: 4 },
          { x: 8, y: 4 },
          { x: 11, y: 4 },
          { x: 2, y: 5 },
          { x: 5, y: 5 },
          { x: 7, y: 5 },
          { x: 9, y: 5 },
          { x: 12, y: 5 },
          { x: 1, y: 6 },
          { x: 4, y: 6 },
          { x: 6, y: 6 },
          { x: 8, y: 6 },
          { x: 10, y: 6 },
          { x: 13, y: 6 },
          { x: 0, y: 7 },
          { x: 2, y: 7 },
          { x: 3, y: 7 },
          { x: 5, y: 7 },
          { x: 9, y: 7 },
          { x: 11, y: 7 },
          { x: 12, y: 7 },
          { x: 14, y: 7 },
          { x: 1, y: 8 },
          { x: 4, y: 8 },
          { x: 6, y: 8 },
          { x: 8, y: 8 },
          { x: 10, y: 8 },
          { x: 13, y: 8 },
          { x: 2, y: 9 },
          { x: 5, y: 9 },
          { x: 7, y: 9 },
          { x: 9, y: 9 },
          { x: 12, y: 9 },
          { x: 3, y: 10 },
          { x: 6, y: 10 },
          { x: 8, y: 10 },
          { x: 11, y: 10 },
          { x: 4, y: 11 },
          { x: 7, y: 11 },
          { x: 10, y: 11 },
          { x: 5, y: 12 },
          { x: 7, y: 12 },
          { x: 9, y: 12 },
          { x: 6, y: 13 },
          { x: 8, y: 13 },
          { x: 7, y: 14 },
        ],
      },
      extension: {
        pos: [
          { x: 5, y: 1 },
          { x: 9, y: 1 },
          { x: 4, y: 2 },
          { x: 6, y: 2 },
          { x: 8, y: 2 },
          { x: 10, y: 2 },
          { x: 3, y: 3 },
          { x: 5, y: 3 },
          { x: 6, y: 3 },
          { x: 8, y: 3 },
          { x: 9, y: 3 },
          { x: 11, y: 3 },
          { x: 2, y: 4 },
          { x: 4, y: 4 },
          { x: 5, y: 4 },
          { x: 9, y: 4 },
          { x: 10, y: 4 },
          { x: 12, y: 4 },
          { x: 1, y: 5 },
          { x: 3, y: 5 },
          { x: 4, y: 5 },
          { x: 10, y: 5 },
          { x: 11, y: 5 },
          { x: 13, y: 5 },
          { x: 2, y: 6 },
          { x: 3, y: 6 },
          { x: 5, y: 6 },
          { x: 9, y: 6 },
          { x: 11, y: 6 },
          { x: 12, y: 6 },
          { x: 2, y: 8 },
          { x: 3, y: 8 },
          { x: 5, y: 8 },
          { x: 9, y: 8 },
          { x: 11, y: 8 },
          { x: 12, y: 8 },
          { x: 1, y: 9 },
          { x: 3, y: 9 },
          { x: 4, y: 9 },
          { x: 10, y: 9 },
          { x: 11, y: 9 },
          { x: 13, y: 9 },
          { x: 2, y: 10 },
          { x: 4, y: 10 },
          { x: 5, y: 10 },
          { x: 9, y: 10 },
          { x: 10, y: 10 },
          { x: 12, y: 10 },
          { x: 3, y: 11 },
          { x: 5, y: 11 },
          { x: 6, y: 11 },
          { x: 8, y: 11 },
          { x: 9, y: 11 },
          { x: 11, y: 11 },
          { x: 4, y: 12 },
          { x: 6, y: 12 },
          { x: 8, y: 12 },
          { x: 10, y: 12 },
          { x: 5, y: 13 },
          { x: 9, y: 13 },
        ],
      },
      tower: {
        pos: [
          { x: 7, y: 1 },
          { x: 7, y: 4 },
          { x: 1, y: 7 },
          { x: 13, y: 7 },
          { x: 7, y: 10 },
          { x: 7, y: 13 },
        ],
      },
      spawn: {
        pos: [
          { x: 7, y: 6 },
          { x: 4, y: 7 },
          { x: 10, y: 7 },
        ],
      },
      terminal: { pos: [{ x: 6, y: 7 }] },
      storage: { pos: [{ x: 8, y: 7 }] },
      link: { pos: [{ x: 7, y: 8 }] },
    },
  },
};

module.exports = blueprints;
