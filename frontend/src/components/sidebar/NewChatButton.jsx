import { BiPlus } from "react-icons/bi";
import { useChatContext } from "../../context/ChatContext";

const NewChatButton = () => {
  const { updateChatId } = useChatContext();

  const newChat = () => {
    updateChatId(null, true);
  };

  return (
    <div className="mt-auto">
      <BiPlus className="w-6 h-6 text-white cursor-pointer" onClick={newChat} />
    </div>
  );
};
export default NewChatButton;
