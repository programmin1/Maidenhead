"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Maidenhead = exports.Maidenhead = function () {
    function Maidenhead(lat, lon) {
        var precision = arguments.length <= 2 || arguments[2] === undefined ? 5 : arguments[2];

        _classCallCheck(this, Maidenhead);

        this.lat = lat;
        this.lon = lon;
        this.precision = precision;
    }

    _createClass(Maidenhead, [{
        key: "_pad_locator",
        value: function _pad_locator() {
            var length = this._locator.length / 2;

            while (length < 5) {
                if (length % 2 == 1) {
                    this._locator += '55';
                } else {
                    this._locator += 'LL';
                }

                length = this._locator.length / 2;
            }
        }
    }, {
        key: "_range_check",
        value: function _range_check(target, range, pos) {
            pos = Number(pos);
            if (pos < -range || pos > range) {
                throw target + " must be between -" + range + " and +" + range;
            }

            return pos;
        }
    }, {
        key: "_convert_part_to_latlon",
        value: function _convert_part_to_latlon(counter, divisor) {
            var grid_lon = this._locator.substr(counter * 2, 1);
            var grid_lat = this._locator.substr(counter * 2 + 1, 1);

            this._lat += this._l2n(grid_lat) * 10.0 / divisor;
            this._lon += this._l2n(grid_lon) * 20.0 / divisor;
        }
    }, {
        key: "_calculate_field",
        value: function _calculate_field() {
            this.__lat = this.__lat / 10 + 0.0000001;
            this.__lon = this.__lon / 20 + 0.0000001;
            this._locator += this._n2l(Math.floor(this.__lon)).toUpperCase() + this._n2l(Math.floor(this.__lat)).toUpperCase();
            this.__precision -= 1;
        }
    }, {
        key: "_calculate_values",
        value: function _calculate_values() {
            for (var counter = 0; counter < this.__precision; counter++) {
                if (counter % 2 == 0) {
                    this._compute_locator(counter, 10);
                } else {
                    this._compute_locator(counter, 24);
                }
            }
        }
    }, {
        key: "_compute_locator",
        value: function _compute_locator(counter, divisor) {
            this.__lat = (this.__lat - Math.floor(this.__lat)) * divisor;
            this.__lon = (this.__lon - Math.floor(this.__lon)) * divisor;

            if (counter % 2 == 0) {
                this._locator += "" + Math.floor(this.__lon) + "" + Math.floor(this.__lat);
            } else {
                this._locator += this._n2l(Math.floor(this.__lon)) + this._n2l(Math.floor(this.__lat));
            }
        }
    }, {
        key: "_l2n",
        value: function _l2n(letter) {
            if (letter.match(/[0-9]+/)) {
                return parseInt(letter);
            } else {
                return letter.toLowerCase().charCodeAt(0) - 97;
            }
        }
    }, {
        key: "_n2l",
        value: function _n2l(number) {
            return String.fromCharCode(97 + number);
        }
    }, {
        key: "lat",
        get: function get() {
            return parseFloat(this._lat.toPrecision(6));
        },
        set: function set(pos) {
            this._lat = this._range_check("lat", 90.0, pos);
        }
    }, {
        key: "lon",
        get: function get() {
            return parseFloat(this._lon.toPrecision(6));
        },
        set: function set(pos) {
            this._lon = this._range_check("lon", 180.0, pos);
        }
    }, {
        key: "locator",
        set: function set(mlocation) {
            if (!Maidenhead.valid(mlocation)) {
                throw "Location is not a valid Maidenhead Locator System string";
            }

            this._locator = mlocation;
            this._lat = -90.00;
            this._lon = -180.00;

            this._pad_locator();

            this._convert_part_to_latlon(0, 1);
            this._convert_part_to_latlon(1, 10);
            this._convert_part_to_latlon(2, 10 * 24);
            this._convert_part_to_latlon(3, 10 * 24 * 10);
            this._convert_part_to_latlon(4, 10 * 24 * 10 * 24);
        },
        get: function get() {
            this._locator = '';
            this.__lat = this.lat + 90.0;
            this.__lon = this.lon + 180.0;
            this.__precision = this.precision;

            this._calculate_field();
            this._calculate_values();

            return this._locator;
        }
    }], [{
        key: "valid",
        value: function valid(mlocation) {
            if (typeof mlocation !== 'string') {
                return false;
            }

            if (mlocation.length < 2) {
                return false;
            }

            if (mlocation.length % 2 !== 0) {
                return false;
            }

            var length = mlocation.length / 2;

            for (var counter = 0; counter < length; i++) {
                var grid = mlocation.substr(counter * 2, 2);

                if (counter == 0) {
                    if (grid.match(/[a-rA-R]{2}/) == null) {
                        return false;
                    }
                } else if (counter % 2 == 0) {
                    if (grid.match(/[a-xA-X]{2}/) == null) {
                        return false;
                    }
                } else {
                    if (grid.match(/[0-9]{2}/) == null) {
                        return false;
                    }
                }
                return true;
            }
        }
    }, {
        key: "toLatLon",
        value: function toLatLon(mlocation) {
            var maidenhead = new Maidenhead();
            maidenhead.locator = mlocation;

            return [maidenhead.lat, maidenhead.lon];
        }
    }]);

    return Maidenhead;
}();

//# sourceMappingURL=maidenhead-compiled.js.map