const ChatBubble = ({ message }) => {
  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      } my-2`}
    >
      <div
        className={`p-3 rounded-lg ${
          message.sender === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatBubble;
