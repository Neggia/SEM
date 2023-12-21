import React from 'react';

const GroupHeader = ({ value, playAction, pauseAction, stopAction }) => {
  return (
    <div>
      Process ID {value}
      <span style={{ color: '#d00', marginLeft: '10px' }}>
        ( runs every {value * 60} minutes on server x )
      </span>
      <button onClick={playAction}>
        <i className="fas fa-play"></i>
      </button>
      <button onClick={pauseAction}>
        <i className="fas fa-pause"></i>
      </button>
      <button onClick={stopAction}>
        <i className="fas fa-stop"></i>
      </button>
    </div>
  );
};

export default GroupHeader;
