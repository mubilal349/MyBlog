import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send, Bot, User } from "lucide-react";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const listRef = useRef();

  // Show chatbot after scrolling 300px
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    socket.on("history", (history) => setMessages(history));
    socket.on("chat.message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
      setIsLoading(false);
    });

    return () => {
      socket.off("history");
      socket.off("chat.message");
    };
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, 100);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    socket.emit("chat.message", { user: "Me", text: input });
    setIsLoading(true);
    setInput("");
  };

  return (
    <div
      className={`fixed right-10 bottom-[150px] w-80 shadow-xl border rounded-xl overflow-hidden flex flex-col bg-white transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-2 flex items-center gap-2">
        <Bot size={18} />
        <h3 className="font-semibold text-sm">AI Chat Assistant</h3>
      </div>

      {/* Chat box */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50"
        style={{ maxHeight: "300px" }}
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-6 text-sm">
            👋 Say hello to start chatting
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.fromBot ? "justify-start" : "justify-end"}`}
          >
            {m.fromBot ? (
              <div className="bg-white border px-3 py-2 rounded-2xl shadow-sm max-w-[75%]">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Bot size={12} /> Bot
                </div>
                <p className="mt-1 text-sm text-gray-800">{m.text}</p>
              </div>
            ) : (
              <div className="bg-blue-600 text-white px-3 py-2 rounded-2xl shadow-sm max-w-[75%]">
                <div className="flex items-center gap-2 text-xs opacity-80">
                  <User size={12} /> {m.user}
                </div>
                <p className="mt-1 text-sm">{m.text}</p>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border px-3 py-2 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Bot size={12} /> Bot
              </div>
              <div className="mt-1 flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="border-t flex items-center gap-2 px-2 py-1 bg-white"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type hello to start chatting..."
          className="flex-1 px-3 py-1 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
