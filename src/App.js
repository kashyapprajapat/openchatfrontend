import './App.css';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { nanoid } from "nanoid"

const socket = io(process.env.REACT_APP_CHAT_BACKEND_URL);

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [sentMessages, setSentMessages] = useState(new Set());

  const sendChat = (e) => {
    e.preventDefault();
    if (!username) {
      const inputUsername = prompt("Please enter your name:");
      if (inputUsername) {
        setUsername(inputUsername);
        const messageId = nanoid(4);
        setSentMessages((prev) => new Set(prev).add(messageId));
        socket.emit("chat", { id: messageId, username: inputUsername, message });
      } else {
        alert("Username is required to send a message.");
      }
    } else {
      const messageId = nanoid(4);
      setSentMessages((prev) => new Set(prev).add(messageId));
      socket.emit("chat", { id: messageId, username, message });
    }
    setMessage('');
  };

  // useEffect(() => {
  //   socket.on("chat", (payload) => {
  //     if (!sentMessages.has(payload.id)) {
  //       setChat((prevChat) => [...prevChat, payload]);
  //     }
  //   });
  // }, [sentMessages]);

  useEffect(() => {
    socket.on('chat', (payload) => {
      if (!sentMessages.has(payload.id)) {
        setChat((prevChat) => [...prevChat, payload]);
      }
    });

    return () => {
      socket.off('chat');
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Open chat 💬🫂</h1>

        {chat.map((payload, index) => (
          <p key={index}><strong>{payload.username}:</strong> {payload.message}</p>
        ))}
        <form onSubmit={sendChat}>
          <input
            type="text"
            name="chat"
            placeholder="Type your message here..."
            value={message}
            autoFocus
            autoComplete='off'
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button type="submit">Send</button>
        </form>
      </header>
    </div>
  );
}

export default App;
