function EncodedPolyline () { }

(function () {
  var _encode = function (v) {
    var negative = v < 0;
    if (negative) {
      v = (~(-v)) + 1;
      v = v * 2; // <<1
      v = ~(v);
    } else {
      v = v * 2; // <<1
    }
    var r = [];
    while (v) {
      var x = v & 0b11111;
      v = v >>> 5;
      if (v) x = x | 0x20;
      r.push (String.fromCharCode (x + 63));
    }
    if (!r.length) return String.fromCharCode (0 + 63);
    return r.join ('');
  }; // _encode

  EncodedPolyline.encode = function (points, f) {
    if (!points.length) return '';

    var n = points[0].length;
    if (!n) return '';

    var r = "";
    var current = [];
    for (var i = 0; i < n; i++) current[i] = 0;

    for (var i = 0; i < points.length; i++) {
      var pt = points[i];
      for (var j = 0; j < n; j++) {
        var v = Math.floor (((pt[j] - current[j]) * f) + 0.5);
        r += _encode (v);
        current[j] += v / f;
      }
    }

    return r;
  }; // encode

  EncodedPolyline.decode = function (input, n, f) {
    var current = [];
    for (var i = 0; i < n; i++) current[i] = 0;

    var r = [];
    var i = 0;

    var matched = true;
    while (matched) {
      matched = false;
      input = input.replace (/^([\x5F-\x7E]*[\x3F-\x5E])/, function (x) {
        var v = 0;
        x.split (/(?:)/).reverse ().forEach (function (y) {
          v = v * (2 ** 5);
          v = v | ((y.charCodeAt (0) - 63) & 0b11111);
        });
        if (v & 1) {
          v = v >>> 1;
          v = -~(~(v)-1);
        } else {
          v = v >>> 1;
        }
        var j = i % n;
        v = current[j] = current[j] + v;

        if (j) {
          r[r.length-1][j] = v / f;
        } else {
          r.push ([v / f]);
        }
        i++;

        matched = true;
        return '';
      });
    } // matched
    return r;
  }; // decode
}) ();

/* License

Copyright 2016-2018 Wakaba <wakaba@suikawiki.org>.

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; see the file COPYING.  If not, write to
the Free Software Foundation, Inc., 59 Temple Place - Suite 330,
Boston, MA 02111-1307, USA.

*/
