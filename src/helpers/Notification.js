import React, { PropTypes } from 'react';

const NotificationContainer = (props) => {
  const messageType = `message-container ${props.notification.type}-message-container`;
  if (props.notification.message) {
    return (
      <div className="messages">
        <div className={ messageType }>
          <div className="message-icon">
            <i className="fa fa-check-circle"></i>
          </div>
          <div className="message-text">
            { props.notification.message }
          </div>
        </div>
      </div>
    );
  }
  return (<div></div>);
};

NotificationContainer.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

export default NotificationContainer;
