// Try out region decomposition in the simulator




module.exports = function () {

    function floodFillRChess(x, y, val, costMatrix, visited, output) {
        if (x < 0 || 49 < x || y < 0 || 49 < y || visited.get(x, y) === 1 || costMatrix.get(x, y) !== val) return;

        output.set(x, y, 1);
        visited.set(x, y, 1);

        floodFillRChess(x - 1, y - 1, val, costMatrix, visited, output);
        floodFillRChess(x, y - 1, val, costMatrix, visited, output);
        floodFillRChess(x + 1, y - 1, val, costMatrix, visited, output);
        floodFillRChess(x - 1, y, val, costMatrix, visited, output);

        floodFillRChess(x + 1, y, val, costMatrix, visited, output);
        floodFillRChess(x - 1, y + 1, val, costMatrix, visited, output);
        floodFillRChess(x, y + 1, val, costMatrix, visited, output);
        floodFillRChess(x + 1, y + 1, val, costMatrix, visited, output);
    }
    function floodFill(x, y, costMatrix, diagonalConnected = true) {
        const val = costMatrix.get(x, y);
        const visited = new PathFinder.CostMatrix();
        const output = new PathFinder.CostMatrix();
        if (diagonalConnected) {
            floodFillRChess(x, y, val, costMatrix, visited, output);
        } else {
            floodFillRCity(x, y, val, costMatrix, visited, output);
        }
        return output;
    }

    /**
     @param {string} roomName
     @return {PathFinder.CostMatrix}
     */
    function walkablePixelsForRoom(roomName) {
        var costMatrix = new PathFinder.CostMatrix();
        for (var y = 0; y < 50; ++y) {
            for (var x = 0; x < 50; ++x) {
                if (Game.map.getTerrainAt(x, y, roomName) != 'wall') {
                    costMatrix.set(x, y, 1);
                }
            }
        }
        return costMatrix;
    }

    /**
     @param {PathFinder.CostMatrix} foregroundPixels - object pixels. modified for output
     @param {number} oob - value used for pixels outside image bounds
     @return {PathFinder.CostMatrix}

     the oob parameter is used so that if an object pixel is at the image boundary
     you can avoid having that reduce the pixel's value in the final output. Set
     it to a high value (e.g., 255) for this. Set oob to 0 to treat out of bounds
     as background pixels.
     */
    function distanceTransform(foregroundPixels, oob = 255) {
        var dist = foregroundPixels; // not a copy. We're modifying the input

        // Variables to represent the 3x3 neighborhood of a pixel.
        var A, B, C;
        var D, E, F;
        var G, H, I;

        var x, y, value;
        for (y = 0; y < 50; ++y) {
            for (x = 0; x < 50; ++x) {
                if (foregroundPixels.get(x, y) !== 0) {
                    A = dist.get(x - 1, y - 1); B = dist.get(x, y - 1); C = dist.get(x + 1, y - 1);
                    D = dist.get(x - 1, y);
                    if (y ==  0) {
                        A = oob; B = oob; C = oob;
                    }
                    if (x ==  0) {
                        A = oob; D = oob;
                    }
                    if (x == 49) {
                        C = oob;
                    }

                    dist.set(x, y, Math.min(A, B, C, D) + 1);
                }
            }
        }

        for (y = 49; y >= 0; --y) {
            for (x = 49; x >= 0; --x) {
                ;                           E = dist.get(x, y); F = dist.get(x + 1, y);
                G = dist.get(x - 1, y + 1); H = dist.get(x, y + 1); I = dist.get(x + 1, y + 1);
                if (y == 49) {
                    G = oob; H = oob; I = oob;
                }
                if (x == 49) {
                    F = oob; I = oob;
                }
                if (x ==  0) {
                    G = oob;
                }

                value = Math.min(E, F + 1, G + 1, H + 1, I + 1);
                dist.set(x, y, value);
            }
        }

        return dist;
    }

    function setPixels(resultCM, toSetCM, value) {
        var x, y;

        for (y = 0; y < 50; ++y) {
            for (x = 0; x < 50; ++x) {
                if (toSetCM.get(x, y)) {
                    resultCM.set(x, y, value);
                }
            }
        }
    }

    function replacePixels(pixels, oldValue, newValue) {
        var x, y;

        for (y = 0; y < 50; ++y) {
            for (x = 0; x < 50; ++x) {
                if (pixels.get(x, y) === oldValue) {
                    pixels.set(x, y, newValue);
                }
            }
        }
    }

    function findInCM(cm, val, startingAt = {x: 0, y: 0}) {
        var x, y;
        for (y = startingAt.y; y < 50; ++y) {
            for (x = startingAt.x; x < 50; ++x) {
                if (cm.get(x, y) === val) {
                    return {x: x, y: y};
                }
            }
        }
    }

    function areAreasAdjacent(areaA, areaB) {
        var x, y, i, j, jmin, jmax, imin, imax;

        for (y = 0; y < 50; ++y) {

            jmin = (y >  0) ? -1 : 0;
            jmax = (y < 49) ? 2 : 1;

            for (x = 0; x < 50; ++x) {

                if (areaA.get(x, y) === 0) continue;

                imin = (x >  0) ? -1 : 0;
                imax = (x < 49) ? 2 : 1;

                for (j = jmin; j < jmax; ++j) {
                    for (i = imin; i < imax; ++i) {
                        if (areaB.get(x + i, y + j) > 0) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    function brushfire(startPixels, mask) {
        var output = new PathFinder.CostMatrix();
        var queue = [];

        var x, y;

        for (y = 0; y < 50; ++y) {
            for (x = 0; x < 50; ++x) {
                if (startPixels.get(x, y) === 0) {
                    output.set(x, y, 255);
                } else {
                    queue.push({x: x, y: y});
                }
            }
        }

        var i, j, jmin, jmax, imin, imax;

        while (queue.length > 0) {
            var current = queue[0];
            queue.splice(0, 1);

            x = current.x;
            y = current.y;
            var value = output.get(x, y);

            jmin = (y >  0) ? -1 : 0;
            jmax = (y < 49) ? 2 : 1;
            imin = (x >  0) ? -1 : 0;
            imax = (x < 49) ? 2 : 1;

            for (j = jmin; j < jmax; ++j) {
                for (i = imin; i < imax; ++i) {
                    if (mask.get(x + i, y + j) > 0 && output.get(x + i, y + j) == 255) {
                        output.set(x + i, y + j, value + 1);
                        queue.push({x: x + i, y: y + j});
                    }
                }
            }
        }

        return output;
    }

    /**
     @param {PathFinder.CostMatrix[]} adjR - the partially built regions to divide nextRegion among
     @param {PathFinder.CostMatrix} nextRegion - the area being divided
     */
    function divideAmongRegions(adjR, nextRegion) {
        var brushfires = _.map(adjR, (r) => {
            return {r: r, dist: brushfire(r, nextRegion)};
        });

        var x, y;

        for (y = 0; y < 50; ++y) {
            for (x = 0; x < 50; ++x) {

                if (nextRegion.get(x, y) > 0) {
                    var min = {r: undefined, dist: {get: function () {
                            return 1000;
                        }}};
                    for (var i in brushfires) {
                        if (brushfires[i].dist.get(x, y) <= min.dist.get(x, y)) {
                            min = brushfires[i];
                        }
                    }
                    min.r.set(x, y, 1);
                }
            }
        }

    }

    /**
     @param {PathFinder.CostMatrix} distanceTransform - representation of area being decomposed
     @return {PathFinder.CostMatrix}

     Returns a costmatrix where pixels are set to a region id. Zero indicates no region.
     The peaks of the input distance transform are seeds for regions.
     */
    function regionDecomposition(distanceTransform) {
        var connectedElevationAreas = [];

        var visited = new PathFinder.CostMatrix();

        var nextZero = {x: 0, y: 0};
        while (nextZero != undefined) {
            var value = distanceTransform.get(nextZero.x, nextZero.y);
            var newArea = floodFill(nextZero.x, nextZero.y, distanceTransform, true);

            setPixels(visited, newArea, 1);
            if (distanceTransform.get(nextZero.x, nextZero.y) > 0) {
                connectedElevationAreas.push({area: newArea, value: value});
            }

            nextZero = findInCM(visited, 0);
        }

        connectedElevationAreas.sort((a, b) => b.value - a.value);

        var R = [];

        for (var i = 0; i < connectedElevationAreas.length; ++i) {
            var count = 0;
            var adjR = [];
            for (var j in R) {
                if (areAreasAdjacent(R[j], connectedElevationAreas[i].area)) {
                    ++count;
                    adjR.push(R[j]);
                }
            }
            if (count === 0) {
                R.push(connectedElevationAreas[i].area.clone());
            } else if (count === 1) {
                setPixels(adjR[0], connectedElevationAreas[i].area, 1);
            } else {
                divideAmongRegions(adjR, connectedElevationAreas[i].area);
            }
        }
        var result = new PathFinder.CostMatrix();
        for (var i = 0; i < R.length; ++i) {
            setPixels(result, R[i], i + 1);
        }
        return result;
    }

    Memory.cpuUsed = 0;
    Memory.timeUsed = 0;
    Memory.count = 0;

    module.exports.loop = function () {
        var startCpu = Game.cpu.getUsed(), startTime = Date.now();

        var regions = regionDecomposition(distanceTransform(walkablePixelsForRoom('sim')));

        var endCpu = Game.cpu.getUsed(), endTime = Date.now();

        drawCostMatrix(regions);

        Memory.cpuUsed += (endCpu - startCpu);
        Memory.timeUsed += (endTime - startTime);
        Memory.count += 1;

        console.log("Time used:", _.round(Memory.timeUsed / Memory.count, 2) + "ms",
            "cpu used:", _.round(Memory.cpuUsed / Memory.count, 2),
            "averaged over:", Memory.count, "ticks");
    };

    function addRandomColor(colors) {
        var digit = "0123456789ABCDEF";
        digit[Math.floor(Math.random() * 16)]
        colors.push('#' + digit[Math.floor(Math.random() * 16)] + digit[Math.floor(Math.random() * 16)] + digit[Math.floor(Math.random() * 16)] + digit[Math.floor(Math.random() * 16)] + digit[Math.floor(Math.random() * 16)] + digit[Math.floor(Math.random() * 16)])
    }

    /**
     @param {PathFinder.CostMatrix} costMatrix
     */
    function drawCostMatrix(costMatrix) {
        var colors = [];

        var vis = new RoomVisual();
        var x, y, v;
        var max = 1;

        for (y = 0; y < 50; ++y) {
            for (x = 0; x < 50; ++x) {
                v = costMatrix.get(x, y);
                while (v >= colors.length) {
                    addRandomColor(colors);
                }
                if (v > 0) {
                    vis.circle(x, y, {radius: 0.2, fill: colors[v], opacity: 1});
                }
            }
        }
    }


};



