import React from 'react';
import Chat from './components/Chat';

function App() {
  return (
    <div>
      <h1>IRC Chat</h1>
      <Chat wsUrl="wss://hometechgoods.com/api/irc" />
    </div>
  );
}

export default App;

