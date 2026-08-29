import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  Send,
  Bot,
  User,
  X,
  MessageCircle,
  Wifi,
  WifiOff,
  Sun,
  Moon,
} from "lucide-react";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // =========================================================
  // THEME
  // =========================================================

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("chatbot-theme");

    if (savedTheme === "dark") {
      return true;
    }

    if (savedTheme === "light") {
      return false;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const listRef = useRef(null);
  const inputRef = useRef(null);

  // =========================================================
  // SAVE THEME
  // =========================================================

  useEffect(() => {
    localStorage.setItem("chatbot-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // =========================================================
  // SHOW CHATBOT AFTER SCROLL
  // =========================================================

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================================================
  // SOCKET EVENTS
  // =========================================================

  useEffect(() => {
    const handleConnect = () => {
      console.log("✅ Chatbot connected");
      console.log("Socket ID:", socket.id);

      setIsConnected(true);
      setError("");
    };

    const handleDisconnect = (reason) => {
      console.log("❌ Chatbot disconnected:", reason);

      setIsConnected(false);
    };

    const handleConnectError = (err) => {
      console.error("❌ Chatbot connection error:", err.message);

      setIsConnected(false);

      setError("Unable to connect to the chatbot server.");
    };

    const handleHistory = (history) => {
      console.log("📚 Chatbot history:", history);

      if (Array.isArray(history)) {
        setMessages(history);
      }
    };

    const handleMessage = (message) => {
      console.log("🤖 Chatbot response:", message);

      setMessages((previous) => [
        ...previous,
        {
          ...message,
          id: message.id || `${Date.now()}-${Math.random()}`,
        },
      ]);

      setIsLoading(false);
      setError("");

      setIsOpen((currentlyOpen) => {
        if (!currentlyOpen && message.fromBot) {
          setUnreadCount((count) => count + 1);
        }

        return currentlyOpen;
      });
    };

    const handleTyping = (data) => {
      setIsLoading(Boolean(data?.typing));
    };

    const handleError = (data) => {
      console.error("❌ Chatbot error:", data);

      setIsLoading(false);

      setError(data?.message || "Something went wrong with the chatbot.");
    };

    socket.on("connect", handleConnect);

    socket.on("disconnect", handleDisconnect);

    socket.on("connect_error", handleConnectError);

    socket.on("history", handleHistory);

    socket.on("chat.message", handleMessage);

    socket.on("chat.typing", handleTyping);

    socket.on("chat.error", handleError);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);

      socket.off("disconnect", handleDisconnect);

      socket.off("connect_error", handleConnectError);

      socket.off("history", handleHistory);

      socket.off("chat.message", handleMessage);

      socket.off("chat.typing", handleTyping);

      socket.off("chat.error", handleError);
    };
  }, []);

  // =========================================================
  // SCROLL TO BOTTOM
  // =========================================================

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, 50);
  };

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const sendMessage = (e) => {
    e.preventDefault();

    const text = input.trim();

    if (!text) {
      return;
    }

    if (isLoading) {
      return;
    }

    if (!socket.connected) {
      setError("Chatbot is not connected to the server.");

      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      user: "Me",
      text,
      fromBot: false,
    };

    setMessages((previous) => [...previous, userMessage]);

    socket.emit("chat.message", {
      user: "Me",
      text,
    });

    setInput("");
    setIsLoading(true);
    setError("");

    scrollToBottom();
  };

  // =========================================================
  // OPEN CHAT
  // =========================================================

  const openChat = () => {
    setIsOpen(true);
    setUnreadCount(0);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // =========================================================
  // CLOSE CHAT
  // =========================================================

  const closeChat = () => {
    setIsOpen(false);
  };

  // =========================================================
  // TOGGLE THEME
  // =========================================================

  const toggleTheme = () => {
    setIsDarkMode((previous) => !previous);
  };

  // =========================================================
  // DON'T SHOW UNTIL USER SCROLLS
  // =========================================================

  if (!isVisible) {
    return null;
  }

  // =========================================================
  // CLOSED CHAT BUTTON
  // =========================================================

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={openChat}
        className={`fixed right-6 bottom-24 z-50 w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer ${
          isDarkMode
            ? "bg-black border border-gray-700 hover:bg-gray-900"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        title="Open AI Assistant"
      >
        <MessageCircle size={25} />

        {/* CONNECTION STATUS */}

        <span
          className={`absolute top-1 right-1 w-3 h-3 rounded-full border-2 ${
            isDarkMode ? "border-black" : "border-white"
          } ${isConnected ? "bg-green-500" : "bg-red-500"}`}
        />

        {/* UNREAD COUNT */}

        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -left-1.5 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    );
  }

  // =========================================================
  // CHAT WINDOW
  // =========================================================

  return (
    <div
      className={`fixed right-6 bottom-8 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] rounded-2xl shadow-2xl overflow-hidden flex flex-col border transition-colors duration-300 ${
        isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className={`px-4 py-3 flex items-center justify-between ${
          isDarkMode
            ? "bg-black border-b border-gray-800"
            : "bg-gradient-to-r from-blue-600 to-blue-500"
        } text-white`}
      >
        {/* LEFT */}

        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center ${
              isDarkMode ? "bg-gray-900 border border-gray-700" : "bg-white/20"
            }`}
          >
            <Bot size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-sm">AI Chat Assistant</h3>

            <div className="flex items-center gap-1.5 mt-0.5">
              {isConnected ? (
                <>
                  <Wifi size={11} />

                  <span className="text-[11px] opacity-90">Online</span>
                </>
              ) : (
                <>
                  <WifiOff size={11} />

                  <span className="text-[11px] opacity-90">Offline</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-1">
          {/* THEME BUTTON */}

          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* CLOSE */}

          <button
            type="button"
            onClick={closeChat}
            className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* =====================================================
          CONNECTION ERROR
      ====================================================== */}

      {error && (
        <div
          className={`px-3 py-2 border-b ${
            isDarkMode
              ? "bg-red-950/40 border-red-900"
              : "bg-red-50 border-red-100"
          }`}
        >
          <p
            className={`text-xs ${
              isDarkMode ? "text-red-400" : "text-red-600"
            }`}
          >
            {error}
          </p>
        </div>
      )}

      {/* =====================================================
          MESSAGE LIST
      ====================================================== */}

      <div
        ref={listRef}
        className={`flex-1 overflow-y-auto p-4 space-y-3 ${
          isDarkMode ? "bg-[#0a0a0a]" : "bg-gray-50"
        }`}
      >
        {/* EMPTY */}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                isDarkMode
                  ? "bg-gray-900 text-white border border-gray-800"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <Bot size={28} />
            </div>

            <h4
              className={`font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              AI Assistant
            </h4>

            <p
              className={`text-xs mt-1 max-w-[240px] ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Hello! 👋 Ask me anything about this website, development, SEO, or
              technology.
            </p>
          </div>
        )}

        {/* MESSAGES */}

        {messages.map((message, index) => (
          <div
            key={message.id || `${index}-${message.text}`}
            className={`flex ${
              message.fromBot ? "justify-start" : "justify-end"
            }`}
          >
            {/* BOT */}

            {message.fromBot ? (
              <div className="flex items-start gap-2 max-w-[82%]">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isDarkMode
                      ? "bg-gray-900 text-white border border-gray-800"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <Bot size={14} />
                </div>

                <div
                  className={`px-3 py-2.5 rounded-2xl rounded-tl-sm shadow-sm ${
                    isDarkMode
                      ? "bg-[#151515] border border-gray-800"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div
                    className={`text-[10px] mb-1 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    AI Assistant
                  </div>

                  <p
                    className={`text-sm whitespace-pre-wrap break-words ${
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            ) : (
              /* USER */

              <div className="flex items-start gap-2 max-w-[82%]">
                <div
                  className={`px-3 py-2.5 rounded-2xl rounded-tr-sm shadow-sm ${
                    isDarkMode
                      ? "bg-white text-black"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 text-[10px] mb-1 ${
                      isDarkMode ? "text-gray-600" : "opacity-80"
                    }`}
                  >
                    <User size={10} />

                    <span>{message.user || "Me"}</span>
                  </div>

                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* =================================================
            TYPING
        ================================================== */}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isDarkMode
                    ? "bg-gray-900 text-white border border-gray-800"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <Bot size={14} />
              </div>

              <div
                className={`px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border ${
                  isDarkMode
                    ? "bg-[#151515] border-gray-800"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />

                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{
                      animationDelay: "0.15s",
                    }}
                  />

                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{
                      animationDelay: "0.3s",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          INPUT
      ====================================================== */}

      <form
        onSubmit={sendMessage}
        className={`border-t p-3 ${
          isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected || isLoading}
            className={`flex-1 min-w-0 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 ${
              isDarkMode
                ? "bg-[#111111] border-gray-800 text-white placeholder:text-gray-600"
                : "bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400"
            }`}
          />

          <button
            type="submit"
            disabled={!input.trim() || !isConnected || isLoading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition disabled:bg-gray-300 disabled:cursor-not-allowed shrink-0 ${
              isDarkMode
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Send size={17} />
          </button>
        </div>

        <p
          className={`text-[10px] text-center mt-2 ${
            isDarkMode ? "text-gray-600" : "text-gray-400"
          }`}
        >
          AI Assistant • Press Enter to send
        </p>
      </form>
    </div>
  );
};

export default Chatbot;
