import { useEffect, useRef } from "react";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import { useChatContext } from "../../context/ChatContext";

const Messages = () => {
  const { messages, loading } = useChatContext();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {messages.length === 0 && !loading && (
        <p className="text-center my-auto text-gray-400">Start a conversation to get started</p>
      )}
      {!loading ? (
        messages.map((message) => (
          <Message key={message._id} message={message} />
        ))
      ) : (
        <MessageSkeleton />
      )}
      <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
    </div>
  );
};

export default Messages;
