import PropTypes from 'prop-types';
import React from 'react';

const NotificationContainer = (props) => {
  const messageType = `message-container ${props.notification.type}-message-container`;
  const notificationType = `message-icon ${props.notification.type}`;
  if (props.notification.message) {
    return (
      <div className="messages">
        <div className={ messageType }>
          <div className={ notificationType }>
            <i className="fa fa-check-circle" />
          </div>
          <div className="message-text">
            { props.notification.message }
          </div>
        </div>
      </div>
    );
  }
  return (<div />);
};

NotificationContainer.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

export default NotificationContainer;
