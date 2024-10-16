function distance2 (a, b) {
  return Math.pow (a.lat-b.lat, 2) + Math.pow (a.lon-b.lon, 2);
} // distance2

function associatePoints (points, routePoints) {
  if (!routePoints.length) return;
  
  let matched = [];
  let hasMissing = false;
  {
    for (let i in points) {
      let n = points[i];
      let np = matched[i] = [];
      for (let j in routePoints) {
        let p = routePoints[j];
        if (n.lat == p.lat && n.lon == p.lon) {
          np.push (parseInt (j));
        }
      }
    }
    let pi = -1;
    N: for (let i in points) {
      let n = points[i];
      for (let j of matched[i]) {
        if (pi < j) {
          pi = n.routeIndex = j;
          continue N;
        }
      }
      hasMissing = true;
    } // N
  }

  let nears = [];
  let mins = [];
  if (hasMissing) {
    let matched2 = [];
    let th2 = 100*100;
    for (let i in points) {
      let n = points[i];
      if (matched[i].length) {
        matched2[i] = matched[i];
        continue;
      }
      let np = nears[i] = [];
      for (let j in routePoints) {
        let p = routePoints[j];
        let d = distance2 (n, p);
        np.push ([parseInt (j), d]);
      }
      nears[i] = nears[i].sort ((a, b) => a[1]-b[1]);
      if (nears[i].length && nears[i][0][1] < th2) {
        matched2[i] = nears[i].filter (_ => _[1] < th2).map (_ => _[0]);
      } else {
        matched2[i] = [];
      }
    }

    hasMissing = false;
    let pi = -1;
    N: for (let i in points) {
      let n = points[i];
      for (let j of matched2[i]) {
        if (pi < j) {
          pi = n.routeIndex = j;
          continue N;
        }
      }
      hasMissing = true;
      mins[i] = pi;
    } // N
  }

  if (hasMissing) {
    let pi = Infinity;
    let maxs = [];
    for (let i = points.length-1; i >= 0; i--) {
      let n = points[i];
      if (n.routeIndex != null) {
        pi = n.routeIndex;
      } else {
        maxs[i] = pi;
      }
    }

    pi = -1;
    N: for (let i in points) {
      let n = points[i];
      if (n.routeIndex != null) {
        pi = n.routeIndex;
      } else {
        for (let np of nears[i] || []) {
          if (pi < np[0] && mins[i] < np[0] && np[0] < maxs[i]) {
            pi = n.routeIndex = np[0];
            continue N;
          }
        }

        if (pi < 0) {
          pi = n.routeIndex = 0;
        } else {
          n.routeIndex = pi;
        }
      }
    } // N
  }
} // associatePoints

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Promise.all ([
  ]).then (() => {
    return {
      associatePoints,
    };
  });
}
  
/*

Copyright 2024 Wakaba <wakaba@suikawiki.org>.

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
