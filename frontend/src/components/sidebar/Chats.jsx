import { useSidebarContext } from "../../context/SidebarContex";
import { useChatContext } from "../../context/ChatContext";
const Chats = () => {
  const { conversations, loading } = useSidebarContext();
  const { updateChatId, chatId } = useChatContext();

  return (
    <div className="py-2 flex flex-col overflow-auto">
      {loading && <p>Loading...</p>}
      {conversations.length === 0 && !loading && <p className="text-center">No chats found</p>}
      {conversations.map((conversation) => (
        <div
          key={conversation._id}
          onClick={() => updateChatId(conversation._id, true)}
          className="rounded-lg block w-full p-2 my-1 bg-gray-800 border border-gray-600 cursor-pointer"
          style={{
            backgroundColor: conversation._id === chatId ? "#0741a6" : "",
          }}
        >
          {new Date(conversation.createdAt).toLocaleString()}
        </div>
      ))}
    </div>
  );
};
export default Chats;
