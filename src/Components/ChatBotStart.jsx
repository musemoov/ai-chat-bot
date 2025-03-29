import React from 'react';
import VortexGlow from './VortexGlow';

const ChatBotStart = ({ onStartChat }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 고퀄리티 움직이는 빛 배경 */}
      <VortexGlow onStartChat={onStartChat} />



      {/* 중앙 버튼 */}
      {/*<div className="absolute z-10 w-full h-full flex items-center justify-center">
        <button
          className="w-[35rem] h-[15rem] bg-gradient-to-tr from-pink-600 to-purple-700 rounded-xl font-extrabold text-7xl text-white uppercase tracking-wider shadow-2xl hover:scale-105 transition"
          onClick={onStartChat}
        >
          Chat AI
        </button>
      </div>*/}


    </div>
  );
};

export default ChatBotStart;