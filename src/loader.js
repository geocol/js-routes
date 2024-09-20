function parseGPX (text) {
  var parser = new GPXParser;
  parser.baseURL = 'about:blank';
  var json = parser.parseText (text);
  json = json || {tracks: []};
  let points = [];
  json.tracks.forEach ((track) => {
    track.segments.forEach (function (seg) {
      seg.points.forEach (function (p) {
        points.push (p);
      });
    });
  });
  return points;
} // parseGPX

function fetchIbuki (u) {
  let urls = {routes: new URL (u)};
  let m;
  let teamId;
  if (urls.routes.pathname.match (/^\/a\/log\//)) {
    urls.routes = new URL ('t/1/locationhistory.json', urls.routes);
    } else if (m = urls.routes.pathname.match (/\/t\/([0-9]+)/)) {
      teamId = m[1];
      urls.routes = new URL ('locationhistory.json', urls.routes);
      urls.results = new URL ('../../results.json', urls.routes);
      urls.info = new URL ('../../info.json', urls.routes);
    } else {
      urls.routes = new URL ('info.json', urls.routes);
      urls.results = new URL ('results.json', urls.routes);
    }
    let fetchStart = performance.now ();
    return Promise.all ([
      fetch (urls.routes).then (res => {
        if (res.status !== 200) throw res;
        return res.json ();
      }),
      urls.results ? fetch (urls.results).then (res => {
        if (res.status !== 200) throw res;
        return res.json ();
      }) : null,
      urls.info ? fetch (urls.info).then (res => {
        if (res.status !== 200) throw res;
        return res.json ();
      }) : null,
    ]).then (([jsonRoutes, jsonResults, jsonInfo]) => {
      let pp = [];
      let routes = parseEncodedRoutes (jsonRoutes.encoded_routes);
      routes.forEach (_ => {
        pp = pp.concat (_.points);
      });
      let teamResultItems = [];
      let teamIds = new Set;
      (jsonResults || {}).items.forEach (_ => {
        if (_.t == teamId) {
          teamResultItems[_.p] = _;
        }
        teamIds.add (_.t);
      });
      let forced = [];
      let mps = ((jsonInfo || jsonRoutes || {}).marked_points || []);
      mps.forEach (mp => {
        if (teamId != null) {
          if (mp.type === 'globalStart' || mp.type === 'partialStart') {
            let tr = teamResultItems[mp.id];
            if (tr && tr.n) {
              forced.push ({timestamp: tr.c, lat: mp.lat, lon: mp.lon,
                            baseOrigIndex: mp.index,
                            source: 'resultStart'});
            }
          }
        } else {
          pp[mp.index].confluential = true;
        }
      });
      (((teamResultItems[0] || {}).d || {}).m || []).forEach (_ => {
        forced.push ({timestamp: _.t, lat: 0, lon: 0, source: 'marker'});
      });
      
      return {
        routePoints: pp,
        markedPoints: mps,
        forcedPoints: forced,
        teamListURL: urls.results + '',
        teamIds,
        teamResultItems,
        elapsed: performance.now () - fetchStart,
      };
    });
  } // fetchIbuki

  function parseEncodedRoutes (encodedRoutes) {
    let routes = [];
    encodedRoutes.forEach (function (_) {
      var latlon = EncodedPolyline.decode (_.latlon, 2, 1e5);
      var elevation = EncodedPolyline.decode (_.elevation, 1, 1e3);
      var distance = _.distance != null ? EncodedPolyline.decode (_.distance, 1, 1e3) : [];
      delete distance[0];
      var timestamp = _.timestamp != null ? EncodedPolyline.decode (_.timestamp, 1, 1e0) : [];
      var roadtype = _.roadtype != null ? EncodedPolyline.decode (_.roadtype, 1, 1e0) : [];
      var points = [];
      for (var i = 0; i < latlon.length; i++) {
        points.push ({lat: latlon[i][0], lon: latlon[i][1],
                      elevation: elevation[i][0],
                      to_distance: (distance[i] ? distance[i][0] : null),
                      timestamp: (timestamp[i] ? timestamp[i][0] : null),
                      roadtype: (roadtype[i] ? roadtype[i][0] : null)});
      }
      if (points.length) routes.push ({points: points});
    });
    return routes;
  } // parseEncodedRoutes

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  let fs = require ('fs').promises;
  let path = require ('path');
  module.exports = Promise.all([
    fs.readFile (path.join (__dirname, './encodedpolyline.js'), 'utf8').then (_ => eval (_ + "; global.EncodedPolyline = EncodedPolyline")),
  ]).then (() => {
    return {
      fetchIbuki,
    };
  });
}

/*
  
Copyright 2019-2024 Wakaba <wakaba@suikawiki.org>.

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
