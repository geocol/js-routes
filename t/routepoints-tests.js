let Tests = [

  [[], [], []],
  [[{lat: 12, lon: 32}], [], [undefined]],
  [[], [{"lat":36.03558,"lon":138.43369},{"lat":36.03509,"lon":138.43318},{"lat":36.03503,"lon":138.43336},{"lat":36.03533,"lon":138.43386},{"lat":36.03538,"lon":138.43433},{"lat":36.03522,"lon":138.43429},{"lat":36.03481,"lon":138.43328},{"lat":36.03458,"lon":138.43318},{"lat":36.0345,"lon":138.43299},{"lat":36.03422,"lon":138.43287},{"lat":36.03388,"lon":138.43258},{"lat":36.03376,"lon":138.4323},{"lat":36.03346,"lon":138.43193},{"lat":36.03317,"lon":138.43181},{"lat":36.03295,"lon":138.43142}], []],
  [[{"lat":36.03558,"lon":138.43369}, {"lat":36.0345,"lon":138.43299}, {"lat":36.03295,"lon":138.43142}],
   [{"lat":36.03558,"lon":138.43369},{"lat":36.03509,"lon":138.43318},{"lat":36.03503,"lon":138.43336},{"lat":36.03533,"lon":138.43386},{"lat":36.03538,"lon":138.43433},{"lat":36.03522,"lon":138.43429},{"lat":36.03481,"lon":138.43328},{"lat":36.03458,"lon":138.43318},{"lat":36.0345,"lon":138.43299},{"lat":36.03422,"lon":138.43287},{"lat":36.03388,"lon":138.43258},{"lat":36.03376,"lon":138.4323},{"lat":36.03346,"lon":138.43193},{"lat":36.03317,"lon":138.43181},{"lat":36.03295,"lon":138.43142}],
   [0, 8, 14]],
  [[{"lat":36.03558,"lon":138.43369}, {"lat":36.03295,"lon":138.43142}, {"lat":36.0345,"lon":138.43299}],
   [{"lat":36.03558,"lon":138.43369},{"lat":36.03509,"lon":138.43318},{"lat":36.03503,"lon":138.43336},{"lat":36.03533,"lon":138.43386},{"lat":36.03538,"lon":138.43433},{"lat":36.03522,"lon":138.43429},{"lat":36.03481,"lon":138.43328},{"lat":36.03458,"lon":138.43318},{"lat":36.0345,"lon":138.43299},{"lat":36.03422,"lon":138.43287},{"lat":36.03388,"lon":138.43258},{"lat":36.03376,"lon":138.4323},{"lat":36.03346,"lon":138.43193},{"lat":36.03317,"lon":138.43181},{"lat":36.03295,"lon":138.43142}],
   [0, 14, 14/*undefined*/]],
  [[{"lat":36.03558,"lon":138.43369}, {"lat":36.0345,"lon":138.43299}, {"lat":36.03295,"lon":138.43142}, {"lat":36.03558,"lon":138.43369}],
   [{"lat":36.03558,"lon":138.43369},{"lat":36.03509,"lon":138.43318},{"lat":36.03503,"lon":138.43336},{"lat":36.03533,"lon":138.43386},{"lat":36.03538,"lon":138.43433},{"lat":36.03522,"lon":138.43429},{"lat":36.03481,"lon":138.43328},{"lat":36.03458,"lon":138.43318},{"lat":36.0345,"lon":138.43299},{"lat":36.03422,"lon":138.43287},{"lat":36.03388,"lon":138.43258},{"lat":36.03376,"lon":138.4323},{"lat":36.03346,"lon":138.43193},{"lat":36.03317,"lon":138.43181},{"lat":36.03295,"lon":138.43142}],
   [0, 8, 14, 14/*undefined*/]],
  [[{"lat":36.03558,"lon":138.43369}, {"lat":36.0345,"lon":138.43299}, {"lat":36.03295,"lon":138.43142}],
   [{"lat":36.03509,"lon":138.43318},{"lat":36.03503,"lon":138.43336},{"lat":36.03533,"lon":138.43386},{"lat":36.03538,"lon":138.43433},{"lat":36.03522,"lon":138.43429},{"lat":36.03481,"lon":138.43328},{"lat":36.03458,"lon":138.43318},{"lat":36.0345,"lon":138.43299},{"lat":36.03422,"lon":138.43287},{"lat":36.03388,"lon":138.43258},{"lat":36.03376,"lon":138.4323},{"lat":36.03346,"lon":138.43193},{"lat":36.03317,"lon":138.43181},{"lat":36.03295,"lon":138.43142}],
   [2/*undefined*/, 7, 13]],
  [[{"lat":36.03558,"lon":138.43369}, {"lat":36.0345,"lon":138.43299}, {"lat":36.03295,"lon":138.43142}],
   [{"lat":36.03509,"lon":138.43318},{"lat":36.03503,"lon":138.43336},{"lat":36.03533,"lon":138.43386},{"lat":36.03538,"lon":138.43433},{"lat":36.03522,"lon":138.43429},{"lat":36.03481,"lon":138.43328},{"lat":36.03458,"lon":138.43318},{"lat":36.0345,"lon":138.43299},{"lat":36.03422,"lon":138.43287},{"lat":36.03388,"lon":138.43258},{"lat":36.03376,"lon":138.4323},{"lat":36.03346,"lon":138.43193},{"lat":36.03317,"lon":138.43181},{"lat":36.03295,"lon":138.43142},{"lat":36.03558,"lon":138.43369}],
   [14, 14/*undefined*/, 14/*undefined*/]],

  [[{"lat":36.03558,"lon":138.43369}, {"lat":36.0345,"lon":138.43299}, {"lat":36.03295,"lon":138.43142}],
   [{"lat":36.03559,"lon":138.43369},{"lat":36.03509,"lon":138.43318},{"lat":36.03503,"lon":138.43336},{"lat":36.03533,"lon":138.43386},{"lat":36.03538,"lon":138.43433},{"lat":36.03522,"lon":138.43429},{"lat":36.03481,"lon":138.43328},{"lat":36.03458,"lon":138.43318},{"lat":36.0345,"lon":138.43299},{"lat":36.03422,"lon":138.43287},{"lat":36.03388,"lon":138.43258},{"lat":36.03376,"lon":138.4323},{"lat":36.03346,"lon":138.43193},{"lat":36.03317,"lon":138.43181},{"lat":36.03295,"lon":138.43142}],
   [0/*undefined*/, 8, 14]],
  [[{"lat":36.03558,"lon":138.43369}, {"lat":36.0344,"lon":138.43299}, {"lat":36.03295,"lon":138.43142}],
   [{"lat":36.03559,"lon":138.43369},{"lat":36.03509,"lon":138.43318},{"lat":36.03503,"lon":138.43336},{"lat":36.03533,"lon":138.43386},{"lat":36.03538,"lon":138.43433},{"lat":36.03522,"lon":138.43429},{"lat":36.03481,"lon":138.43328},{"lat":36.03458,"lon":138.43318},{"lat":36.0345,"lon":138.43299},{"lat":36.03422,"lon":138.43287},{"lat":36.03388,"lon":138.43258},{"lat":36.03376,"lon":138.4323},{"lat":36.03346,"lon":138.43193},{"lat":36.03317,"lon":138.43181},{"lat":36.03295,"lon":138.43142}],
   [0/*undefined*/, 8/*undefined*/, 14]],
  
  [[{"lat":-36.03558,"lon":-138.43369}, {"lat":-36.0344,"lon":-138.43299}, {"lat":-36.03295,"lon":-138.43142}],
   [{"lat":36.03559,"lon":138.43369},{"lat":36.03509,"lon":138.43318},{"lat":36.03503,"lon":138.43336},{"lat":36.03533,"lon":138.43386},{"lat":36.03538,"lon":138.43433},{"lat":36.03522,"lon":138.43429},{"lat":36.03481,"lon":138.43328},{"lat":36.03458,"lon":138.43318},{"lat":36.0345,"lon":138.43299},{"lat":36.03422,"lon":138.43287},{"lat":36.03388,"lon":138.43258},{"lat":36.03376,"lon":138.4323},{"lat":36.03346,"lon":138.43193},{"lat":36.03317,"lon":138.43181},{"lat":36.03295,"lon":138.43142}],
   [14, 14, 14 /*undefined, undefined, undefined*/]],

];

Promise.all ([
  require ('../src/routepoints.js'),
]).then (async ([rp]) => {

  let testCount = 0;
  let failed = [];

  function ok () {
    process.stdout.write ("ok " + ++testCount + "\n");
  }

  function ng (x, a) {
    process.stdout.write ("not ok " + ++testCount + " # Got: |"+a+"|, expected: |"+x+"|\n");
    failed.push (testCount);
  }

  function test_done () {
    process.stdout.write ("1.." + testCount + "\n");
    if (failed.length) {
      process.stdout.write ("Failed: " + failed.join (', ') + "\n");
    }
  }

  for (let test of Tests) {
    rp.associatePoints (test[0], test[1]);
    let actual = test[0].map (_ => _.routeIndex).join ("\t");
    let expected = test[2].join ("\t");
    if (actual === expected) {
      ok ();
    } else {
      ng (expected, actual);
    }
  }
  
  test_done ();
});

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