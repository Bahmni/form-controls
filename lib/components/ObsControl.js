'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObsControl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Label = require('./Label');

var _TextBox = require('./TextBox');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ObsControl = exports.ObsControl = function (_Component) {
  _inherits(ObsControl, _Component);

  function ObsControl() {
    _classCallCheck(this, ObsControl);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ObsControl).apply(this, arguments));
  }

  _createClass(ObsControl, [{
    key: 'getFormControl',
    value: function getFormControl(obs) {
      switch (obs.type) {
        case 'label':
          return _react2.default.createElement(_Label.Label, { key: obs.id, obs: obs });
        case 'numeric':
        case 'text':
          return _react2.default.createElement(_TextBox.TextBox, { key: obs.id, obs: obs });
        default:
          return null;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        null,
        _lodash2.default.map(this.props.obs, function (obs) {
          return _this2.getFormControl(obs);
        })
      );
    }
  }]);

  return ObsControl;
}(_react.Component);

ObsControl.propTypes = {
  obs: _react.PropTypes.array.isRequired
};