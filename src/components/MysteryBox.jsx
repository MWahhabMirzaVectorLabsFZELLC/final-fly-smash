import React from 'react'
import Gift from './Gift'

export default function MysteryBox({ x, y, size, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        fontSize: `${size}rem`,
        cursor: 'pointer',
        transition: 'all 0.1s ease-out',
      }}
      className="mystery-box"
    >
      <div className="box-container">
        {/* <Gift/> */}
         <span className="box-lid"><img src={require('../assets/giftdrop.png')} alt="" /></span>
        {/* <span className="box-base">📦</span> */} 
      </div>
      <style jsx>{`
        .mystery-box {
          animation: float 2s ease-in-out infinite;
        }
        .box-container {
          position: relative;
          display: inline-block;
        }
        .box-lid {
          position: absolute;
          top: -0.2em;
          left: 0;
          transition: transform 0.3s ease;
        }
        .box-base {
          opacity: 0.7;
        }
        .mystery-box:hover .box-lid {
          transform: translateY(-0.2em) rotate(-5deg);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}