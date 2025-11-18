import React, { useState, useEffect, useRef } from 'react';

const Chat = ({ wsUrl = 'wss://hometechgoods.com/api/irc' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const wsRef = useRef(null);

  // Parse raw IRC JSON to human-readable text
  const parseIRCMessage = (data) => {
    if (data.system) return `[SYSTEM] ${data.system}`;
    if (data.event === 'join') return `[JOIN] ${data.nick} joined ${data.channel}`;
    if (data.event === 'part') return `[PART] ${data.nick} left ${data.channel}`;
    if (data.type === 'message') return `[MSG] ${data.nick}: ${data.message}`;
    if (data.event === 'quit') return `[QUIT] ${data.nick} disconnected`;
    // fallback for unknown structure
    return JSON.stringify(data);
  };

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setMessages((m) => [...m, '✅ WebSocket connected']);
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        const text = parseIRCMessage(data);
        setMessages((m) => [...m, text]);
      } catch (err) {
        // fallback if message is plain text
        setMessages((m) => [...m, e.data]);
      }
    };

    ws.onerror = (e) => {
      console.error('WebSocket error', e);
      setMessages((m) => [...m, '⚠️ WebSocket error']);
    };

    ws.onclose = (e) => {
      setMessages((m) => [...m, `❌ WebSocket closed (code: ${e.code})`]);
    };

    return () => {
      ws.close();
    };
  }, [wsUrl]);

  const sendMessage = () => {
    if (!input.trim()) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', message: input }));
      setInput('');
    } else {
      setMessages((m) => [...m, '⚠️ Cannot send, WebSocket not open']);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto' }}>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          height: '400px',
          overflowY: 'scroll',
          marginBottom: '1rem',
          backgroundColor: '#f9f9f9',
          fontFamily: 'monospace',
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message"
        style={{ width: '80%', marginRight: '0.5rem' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;

