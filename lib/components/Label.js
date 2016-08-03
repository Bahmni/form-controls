'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Label = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Label = exports.Label = function Label(_ref) {
  var obs = _ref.obs;
  return _react2.default.createElement(
    'span',
    null,
    obs.value
  );
};

Label.propTypes = {
  obs: _react.PropTypes.object.isRequired
};