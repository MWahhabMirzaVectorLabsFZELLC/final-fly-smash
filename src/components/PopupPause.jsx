import React from 'react';
import PropTypes from 'prop-types';
import { IoVolumeMute, IoVolumeHigh } from 'react-icons/io5';
import panel from '../assets/game-over-popup.png';
import homebtn from '../assets/button1.png';
import resumebtn from '../assets/button2.png';

const PopupPause = ({ onResume, onHome, isVisible, isMuted, onMuteToggle }) => {
  if (!isVisible) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const containerStyle = {
    // background: 'linear-gradient(135deg, #1E90FF, #00BFFF)',
    backgroundImage:`url(${panel})`,
    backgroundRepeat: 'no-repeate',
    backgroundSize: 'cover',
    padding: '40px',
    borderRadius: '30px',
    // boxShadow: `
    //   5px 6px 0px -2px rgba(0, 0, 0, 0.5), 
    //   -6px 5px 0px -2px rgba(0, 0, 0, 0.5),
    //   0px -2px 0px 2px rgba(255, 255, 255, 0.3), 
    //   0px 10px 0px 0px rgba(0, 0, 0, 0.3),
    //   0px -10px 0px 1px rgba(255, 255, 255, 0.1), 
    //   0px 0px 180px 90px rgba(0, 0, 0, 0.5)`,
    width: '90%',
    maxWidth: '640px',
    textAlign: 'center',
    flexDirection: 'column',
    position: 'relative',
  };

  const titleStyle = {
    fontFamily: '"Skranji", cursive',
    fontSize: '40px',
    color: '#FFFFFF',
    marginBottom: '20px',
    // textShadow: '3px 6px #07489c'
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'vertical',
    alignItems: 'center',
    marginTop: '30px',
    gap: '15px',
  };

  const buttonStyle = {
    borderRadius: '39px',
    border: '1px solid #4E342E',
    cursor: 'pointer',
    backgroundColor: 'wheat'
  };

  const resumeButtonStyle = {
    ...buttonStyle,
   
  };

  const homeButtonStyle = {
    ...buttonStyle,
    paddingLeft: '4px'
   
  };

  const hoverStyle = {
    boxShadow: '0px 0px 0px 4px rgba(255, 255, 255, 0.7), 0px 2px 0px 3px rgba(0, 0, 0, 0.7), inset 2px 2px 10px 3px rgba(255, 255, 255, 0.1)',
  };

  const iconContainerStyle = {
    position: 'absolute',
    top: '15px',
    right: '25px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.3)',
  };

  return (
    <div style={overlayStyle}>
      <div style={containerStyle}>
        <div style={iconContainerStyle} onClick={onMuteToggle}>
          {isMuted ? (
            <IoVolumeMute size={24} color="#1E90FF" />
          ) : (
            <IoVolumeHigh size={24} color="#1E90FF" />
          )}
        </div>

        <h2 style={titleStyle}>Game Paused</h2>

        <div style={buttonContainerStyle}>
          <button
            style={resumeButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = hoverStyle.boxShadow)}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = resumeButtonStyle.boxShadow)}
            onClick={onResume}
          >
          <img src={resumebtn} alt="resume button" />
          </button>
          <button
            style={homeButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = hoverStyle.boxShadow)}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = homeButtonStyle.boxShadow)}
            onClick={onHome}
          >
            <img src={homebtn} alt="home" />
          </button>
        </div>
      </div>
    </div>
  );
};

PopupPause.propTypes = {
  onResume: PropTypes.func.isRequired,
  onHome: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  isMuted: PropTypes.bool.isRequired,
  onMuteToggle: PropTypes.func.isRequired,
};

export default PopupPause;