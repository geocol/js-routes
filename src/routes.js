function distance2 (a, b) {
  return Math.pow (a.lat-b.lat, 2) + Math.pow (a.lon-b.lon, 2);
} // distance2

// Hubeny's distance with WGS84
function distanceH84(p1, p2) {
  var d2r = (deg) => deg * Math.PI / 180;

    var lat1 = d2r (p1.lat);
    var lat2 = d2r (p2.lat);

    var latDelta = lat1 - lat2;
    var lonDelta = Math.abs (d2r (p1.lon) - d2r (p2.lon));
    if (lonDelta > Math.PI) lonDelta = 2 * Math.PI - lonDelta;
    var latAvg = (lat1 + lat2) / 2;

    // WGS84
    var a = 6378137.000;
    var e2 = 0.00669437999019758; // e^2 = (a^2 - b^2) / a^2
    var a1e2 = 6335439.32729246; // a * (1 - e^2)

    var W2 = 1 - e2 * Math.pow (Math.sin (latAvg), 2);
    var W = Math.pow (W2, 0.5);
    var M = a1e2 / (W2 * W);
    var N = a / W;

    return Math.sqrt (Math.pow (latDelta * M, 2) +
                      Math.pow (lonDelta * N * Math.cos (latAvg), 2));
  } // distanceH84

  // lat ~ +-90 not supported
  function lineDistance (p, s, e) {
    let v = Math.pow (s.lat - e.lat, 2) + Math.pow (s.lon - e.lon, 2);
    if (v === 0) { // s == e
      return Math.pow (s.lat - p.lat, 2) + Math.pow (s.lon - p.lon, 2);
    } else {
      let t = (s.lat - e.lat) * (s.lat - p.lat) + (s.lon - e.lon) * (s.lon - p.lon);
      t /= v;
      if (t < 0) {
        return Math.pow (s.lat - p.lat, 2) + Math.pow (s.lon - p.lon, 2);
      } else if (1 < t) {
        return Math.pow (e.lat - p.lat, 2) + Math.pow (e.lon - p.lon, 2);
      } else {
        let x = s.lat - t * (s.lat - e.lat);
        let y = s.lon - t * (s.lon - e.lon);
        return Math.pow (x - p.lat, 2) + Math.pow (y - p.lon, 2);
      }
    }
  } // lineDistance

function getNearest (points, p) {
  let minD = Infinity;
  let minDi = -1;
  for (let i = 0; i < points.length; i++) {
    let d = distance2 (p, points[i]);
    if (d < minD) {
      minD = d;
      minDi = i;
    }
  }
  return {distance2: minD, index: minDi, point: points[minDi]};
} // getNearest

  function findNears (points, distances, refI, startI, endI, threshold) {
    let segments = [];
    let state = 0;
    let minD;
    for (let i = startI; i <= endI; i++) {
      let d = refI >= i ? distances[refI][i] : distances[i][refI];
      if (state === 2) {
        if (d < threshold) {
          segments.unshift ([i, i, i]);
          minD = d;
          state = 1;
        } else {
          //
        }
      } else if (state === 1) {
        if (d < threshold) {
          segments[0][2] = i;
          if (d < minD) {
            minD = d;
            minDi = segments[0][1] = i;
          }
        } else {
          state = 2;
        }
      } else if (state === 0) {
        if (d < threshold) {
          segments.unshift ([i, i, i]);
          minD = d;
          state = 1;
        } else {
          state = 2;
        }
      }
    }

    return segments.reverse ();
  } // findNears

function computeBase (pointsList, radius, computed, {thresholdFactor = 1} = {}) {
  let start = performance.now ();

  let threshold = 0.000001;
  if (pointsList[0].length) {
    let distancePerLat = distanceH84 (pointsList[0][0],
                                      {lat: pointsList[0][0].lat + 1,
                                       lon: pointsList[0][0].lon});
    threshold = radius / distancePerLat;
    threshold = threshold * threshold;
  }
  threshold *= thresholdFactor;
  let thresholdC = threshold * 3*3;
  let thresholdCP = thresholdC;
  computed.thresholdMInput = radius;
  computed.threshold = threshold;
  computed.thresholdC = thresholdC;

    {
      let rdp = (points, start, end, list, depth) => {
        if (end - start <= 2 || depth > 100000) {
          for (let i = start + 1; i <= end - 1; i++) {
            list.push (i);
          }
          return;
        }
      
        let max = 0;
        let maxI = start + 1;
        for (let i = start + 1; i <= end - 1; i++) {
          let d = lineDistance (points[i], points[start], points[end]);
          if (d > max) {
            max = d;
            maxI = i;
          }
        }
        list.push (maxI);
        let l1 = rdp (points, start, maxI, list, depth+1);
        let l2 = rdp (points, maxI, end, list, depth+1);
      }; // rdp

      let list = [];
      if (pointsList[0].length >= 1) {
        list.push (0);
        if (pointsList[0].length >= 2) {
          list.push (pointsList[0].length-1);
          rdp (pointsList[0], 0, pointsList[0].length-1, list, 0);
        }
      }
      
      let max = list.length - 1;
      for (let i = 0; i <= max; i++) {
        pointsList[0][list[i]].origIndex = list[i];
        pointsList[0][list[i]].pointImportance = (max - i) / max;
      }
    }
    let basePoints;
    {
      let rdp = (points, start, end, th, needMore) => {
        if (end - start <= 2) return points.slice (start, end + 1);

        let maxImportance = -1;
        let maxImportanceI = start + 1;
        let thD = false;
        for (let i = start + 1; i <= end - 1; i++) {
          if (points[i].confluential) {
            maxImportance = Infinity;
            maxImportanceI = i;
            thD = true;
            break;
          }
          if (thD ||
              lineDistance (points[i], points[start], points[end]) > th) {
            thD = true;
          }

          if (maxImportance < points[i].pointImportance) {
            maxImportance = points[i].pointImportance;
            maxImportanceI = i;
          }
        }
        if (thD ||
            (end - start > 1 ? needMore (points[start], points[end]) : 0)) {
          let l1 = rdp (points, start, maxImportanceI, th, needMore);
          let l2 = rdp (points, maxImportanceI, end, th, needMore);
          return l1.concat (l2.slice (1));
        } else {
          return [points[start], points[end]];
        }
      }; // rdp

      let t1 = threshold /2/2;
      let t = threshold;
      basePoints = rdp (pointsList[0], 0, pointsList[0].length-1, t1, (p1, p2) => {
        return distance2 (p1, p2) > t;
      });
    }
    
    let augPoints = [];
    let confluentialPoints = [];
    if (basePoints.length) {
      basePoints[0].index = 0;
      augPoints.push (basePoints[0]);
      if (basePoints[0].confluential) {
        confluentialPoints.push (0);
      }
    }
  for (let i = 1; i < basePoints.length; i++) {
    if (Number.isFinite (basePoints[i].to_distance)) {
      let d = distance2 (basePoints[i-1], basePoints[i]);
      if (d > threshold) {
        let n = Math.floor (Math.pow (d, 0.5) / Math.pow (threshold, 0.5)) + 1;
        for (let j = 1; j < n; j++) {
          let p = {lat: (basePoints[i].lat*j+(basePoints[i-1].lat*(n-j)))/n,
                   lon: (basePoints[i].lon*j+(basePoints[i-1].lon*(n-j)))/n,
                   additional: true};
          p.index = augPoints.length;
          augPoints.push (p);
        }
      }
    }
    basePoints[i].index = augPoints.length;
    augPoints.push (basePoints[i]);
    if (basePoints[i].confluential) {
      confluentialPoints.push (augPoints.length-1);
    }
  }

    if (augPoints.length && !confluentialPoints.length) {
      confluentialPoints.push (0);
      if (augPoints.length > 1) {
        confluentialPoints.push (augPoints.length-1);
      }
    }

    let distances = [];
    for (let i = 0; i < augPoints.length; i++) {
      distances[i] = [];
      distances[i][i] = 0;
      for (let j = 0; j < i; j++) {
        distances[i][j] = /*distances[j][i] =*/ distance2 (augPoints[i], augPoints[j]);
      }
    }

    let useThC = [];
    confluentialPoints.forEach (i => {
      useThC[i] = true;
      for (let k = 0; k < i; k++) {
        if (distances[i][k] < thresholdCP) {
          useThC[k] = true;
        }
      }
      for (let k = i + 1; k < augPoints.length; k++) {
        if (distances[k][i] < thresholdCP) {
          useThC[k] = true;
        }
      }
    });
    
    let nears = [];
    for (let i = 0; i < augPoints.length; i++) {
      nears[i] = findNears (augPoints, distances, i, 0, augPoints.length-1, useThC[i] ? thresholdC : threshold);
      if (nears[i].length === 0) {
        nears[i].push ([i, i, i]);
      }
    }

    let phases = [];
    let i2p = [];
    {
      let size = 0;
      let seg;
      for (let i = 0; i < augPoints.length; i++) {
        let s = nears[i].length;
        if (s === size) {
          let matched = true;
          let change = [];
          for (let k = 0; k < s; k++) {
            if (seg[2][k] === +1 && nears[i-1][k][2] >= nears[i][k][0]) {
              //
            } else if (seg[2][k] === -1 && nears[i][k][2] >= nears[i-1][k][0]) {
              //
            } else if (seg[2][k] === 0) {
              if (nears[i-1][k][2] >= nears[i][k][0] &&
                  (nears[i-1][k][0] <= nears[i][k][0] ||
                   nears[i-1][k][2] <= nears[i][k][2])) {
                if (nears[i-1][k][0] < nears[i][k][0] ||
                    nears[i-1][k][2] < nears[i][k][2]) change[k] = +1;
                //
              } else if (nears[i][k][2] >= nears[i-1][k][0] &&
                         (nears[i][k][0] <= nears[i-1][k][0] ||
                          nears[i][k][2] <= nears[i-1][k][2])) {
                if (nears[i][k][0] < nears[i-1][k][0] ||
                    nears[i][k][2] < nears[i-1][k][2]) change[k] = -1;
                //
              } else {
                matched = false;
                break;
              }
            } else {
              matched = false;
              break;
            }
          } // k
          if (matched) {
            seg[1] = i;
            i2p[i] = seg.index;
            for (let k in change) {
              seg[2][k] = change[k];
            }
          } else {
            seg = [i, i, nears[i].map (_ => 0)];
            seg.index = phases.length;
            i2p[i] = seg.index;
            phases.unshift (seg);
            //size = s;
          }
        } else { // size boundary
          seg = [i, i, nears[i].map (_ => 0)];
          seg.index = phases.length;
          i2p[i] = seg.index;
          phases.unshift (seg);
          size = s;
        }
      }
    }
    phases = phases.reverse ();

  computed.elapsed.base = performance.now () - start;
  computed._distances = distances;
  computed.confluentialPoints = confluentialPoints;
  computed.useThresholdC = useThC;
  computed.basePoints = augPoints;
  computed.baseNears = nears;
  computed.basePhases = phases;
  computed._i2p = i2p;
} // computeBase

function computeData (pointsList, computed) {
  let start = performance.now ();

  let threshold = computed.threshold;
  let distances = computed._distances;
  let augPoints = computed.basePoints;
  let nears = computed.baseNears;
  let phases = computed.basePhases;
  let i2p = computed._i2p;

    let dataPoints = [];
    let maxBaseIndex = Infinity;
    {
      let forced = pointsList[2].slice ().sort ((a, b) => a.timestamp - b.timestamp);
      computed.forced = forced.slice ();
      let o = 0;
      let prevFP;
      for (let p of pointsList[1]) {
        while (forced.length && forced[0].timestamp < p.timestamp) {
          let fp = forced.shift ();
          let bp = pointsList[0][fp.baseOrigIndex];
          fp.index = dataPoints.length;
          if (bp) fp.baseIndex = bp.index;
          dataPoints.push (fp);
          if (prevFP) {
            prevFP.maxBaseIndex = bp ? fp.baseIndex : Infinity;
          } else {
            maxBaseIndex = bp ? fp.baseIndex : Infinity;
          }
          prevFP = fp;
        }
        p.index = dataPoints.length;
        p.origIndex = o++;
        dataPoints.push (p);
      }
      while (forced.length) {
        let fp = forced.shift ();
        let bp = pointsList[0][fp.baseOrigIndex];
        fp.index = dataPoints.length;
        if (bp) fp.baseIndex = bp.index;
        dataPoints.push (fp);
        if (prevFP) prevFP.maxBaseIndex = bp ? fp.baseIndex : Infinity;
        prevFP = fp;
      }
      if (prevFP) prevFP.maxBaseIndex = Infinity;
    }

    let d2b = [];
    let reverted = [];
    {
      let currentI = -1;
      let j;
      let revertable = null;
      let checkRevertable = (ok) => {
        if (revertable) {
          if (ok) {
            revertable = null;
          } else {
            if (revertable.failed++ > 2) {
              reverted.push ([currentI, revertable.currentI]);
              currentI = revertable.currentI;
              delete d2b[revertable.j].effectiveIndex;
              delete d2b[revertable.j].phase;
              j = revertable.j + 1;
              revertable = null;
            }
          }
        }
      }; // checkRevertable
      J: for (j = 0; j < dataPoints.length; j++) {
        let dp = dataPoints[j];
        if (dp.baseIndex != null) {
          let link = d2b[j] = {dataIndex: j, effectiveIndex: dp.baseIndex,
                               nearestIndex: dp.baseIndex,
                               phase: i2p[dp.baseIndex],
                               forced: dp.source};
          maxBaseIndex = dp.maxBaseIndex;
          checkRevertable (true); continue J;
        }
        
        let nearest = getNearest (augPoints, dp);
        if (nearest.distance2 < threshold) {
          let i = nearest.index;
          let link = d2b[j] = {dataIndex: j, nearestIndex: i};

          let candI = null;
          N: for (let n of nears[i]) {
            if (n[1] === i && false) {
              if (currentI < i) {
                candI = i;
                break;
              } else if (n[0] <= currentI) {
                if (currentI <= n[2]) {
                  link.unusedIndex = n[1];
                  checkRevertable (false); continue J;
                } else {
                  continue N;
                }
              }

              if (i2p[currentI] === i2p[n[1]]) {
                link.unusedIndex = n[1];
                checkRevertable (false); continue J;
              }
            } else {
              if (i2p[currentI] === i2p[n[0]] && currentI < n[1]) {
                candI = n[1];
                break;
              }

              if (currentI <= n[2]) {
                let minD = Infinity;
                let minDi = -1;
                let minDi2 = -1;
                for (let k = n[0]; k <= n[2]; k++) {
                  let d = distance2 (augPoints[k], dp);
                  if (d < minD) {
                    minD = d;
                    minDi = k;
                    if (currentI < k) minDi2 = k;
                  }
                }
                if (currentI < minDi) {
                  candI = minDi;
                  break;
                } else if (currentI < minDi2) {
                  candI = minDi2;
                  break;
                } else if (n[0] <= currentI) {
                  if (currentI === n[2]) {
                    continue N;
                  } else if (currentI < n[2] &&
                             distance2 (augPoints[currentI+1], dp) < threshold) {
                    candI = currentI + 1;
                    break;
                  } else {
                    link.unusedIndex = n[1];
                    checkRevertable (false); continue J;
                  }
                }
              }
            }
          } // N
          if (candI !== null) {
            let hasNonSmall = false;
            if (i2p[currentI] < i2p[candI]) {
              // Check whether the current phase can be completed or not
              // in case the segment can be revisited
              let checkEndI = candI;
              N: for (let n of nears[currentI]) {
                let c = false;
                if (i2p[currentI] < i2p[n[1]] && i2p[n[1]] < i2p[candI]) {
                  c = true;
                } else if (i2p[currentI] <= i2p[n[2]] &&
                           i2p[n[1]] < i2p[candI] && candI <= n[2]) {
                  c = true;
                } else if (i2p[n[0]] <= i2p[currentI] &&
                           i2p[currentI] <= i2p[n[2]]) {
                  if (nears[currentI] > 1) {
                    c = true;
                  } else {
                    c = true;
                    checkEndI = n[2];
                  }
                } else if (i2p[n[2]] < i2p[currentI]) {
                  continue N;
                } else if (candI < n[0]) {
                  break N;
                } else {
                  c = true;
                  checkEndI = n[2];
                }
                if (c) {
                  if (0 <= i2p[n[1]] - i2p[currentI] &&
                      i2p[n[1]] - i2p[currentI] < 10) {
                    let small = true;
                    let kk = [];
                    for (let k = i2p[currentI]; k <= i2p[n[1]]; k++) {
                      kk.push (phases[k]);
                    }
                    kk[0] = [currentI, kk[0][1]];
                    let kkLast = kk[kk.length-1] = kk.at (-1).slice ();
                    if (kkLast[1] > checkEndI) kkLast[1] = checkEndI;
                    for (let ph of kk) {
                      if (ph[1] - ph[0] < 10) {
                        let l = Math.floor ((ph[0] + ph[1]) / 2);
                        if ((currentI <= l ? distances[l][currentI] : distances[currentI][l]) < threshold*3*3) {
                          //
                        } else {
                          small = false;
                          break;
                        }
                      } else {
                        small = false;
                        break;
                      }
                    } // k
                    if (!small) {
                      //checkRevertable (false); continue J;
                      hasNonSmall = true;
                    }
                  } else {
                    checkRevertable (false); continue J;
                  }
                } else {
                  //
                } // c
              } // N
            } // phase to be changed
            if (currentI !== candI && candI < maxBaseIndex) {
              if (hasNonSmall || i2p[candI] - i2p[currentI] > 5) {
                if (revertable) {
                  revertable.failed = Infinity;
                  checkRevertable (false);
                  continue J;
                }
                revertable = {
                  failed: 0,
                  currentI, j,
                };
                link.effectiveIndex = candI;
                currentI = candI;
                link.phase = i2p[candI];
                continue J;
              } else {
                link.effectiveIndex = candI;
                currentI = candI;
                link.phase = i2p[candI];
                checkRevertable (true); continue J;
              }
            } else {
              link.unusedIndex = candI;
              checkRevertable (false); continue J;
            }
          } // candI
        } // nearest
        checkRevertable (false); continue J;
      } // J
      if (revertable) {
        revertable.failed = Infinity;
        checkRevertable (false);
      }
    }

  computed.elapsed.data = performance.now () - start;
  computed.dataPoints = dataPoints;
  computed.dataToBase = d2b;
  computed.reverted = reverted;
} // computeData

function computeDataPointTimes (pointsList, points, computed) {
  let b2d = [];
  (computed.dataToBase || []).forEach (link => {
    if (link.effectiveIndex != null) {
      b2d[link.effectiveIndex] = link;
    }
  });

  computed.pointTimes = [];
  points.forEach (mp => {
    let bp = pointsList[0][mp.index];
    let link = b2d[bp.index];
    if (link) {
      let dp = computed.dataPoints[link.dataIndex];
      let tt = computed.pointTimes[mp.id] = {
        baseIndex: bp.index,
        dataIndex: [link.dataIndex, link.dataIndex],
        timestamp: dp.timestamp,
      };
    } else {
      let tt = computed.pointTimes[mp.id] = {baseIndex: bp.index};
      let distance0 = 0;
      let pp = bp;
      for (let i = bp.index - 1; i >= 0; i--) {
        let link = b2d[i];
        if (link) {
          tt.dataIndex = [link.dataIndex, null];
          distance0 += distanceH84 (pp, computed.basePoints[i]);
          pp = computed.basePoints[i];
          break;
        }
      }
      let distance1 = 0;
      if (tt.dataIndex) {
        let pp = bp;
        for (let i = bp.index + 1; i < computed.basePoints.length; i++) {
          let link = b2d[i];
          if (link) {
            tt.dataIndex[1] = link.dataIndex;
            distance1 += distanceH84 (pp, computed.basePoints[i]);
            pp = computed.basePoints[i];
            break;
          }
        }
      }
      if (tt.dataIndex) {
        if (tt.dataIndex[1] === null) {
          delete tt.dataIndex;
        } else {
          let t1 = computed.dataPoints[tt.dataIndex[0]].timestamp;
          let t2 = computed.dataPoints[tt.dataIndex[1]].timestamp;
          tt.timestamp = t1 + (t2 - t1) * distance0 / ((distance0 + distance1) || 1);
          //console.log ("X XX", tt.dataIndex, t1, t2, t2-t1, distance0, distance1);
        }
      }
    }
  });
} // computeDataPointTimes

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Promise.all ([
  ]).then (() => {
    return {
      computeBase, computeData, computeDataPointTimes,
    };
  });
}

/*
  
Copyright 2019-2026 Wakaba <wakaba@suikawiki.org>.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Affero General Public License for more details.

You does not have received a copy of the GNU Affero General Public
License along with this program, see <https://www.gnu.org/licenses/>.

*/
