import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useAuthContext } from "../../context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import Spinner from "react-bootstrap/Spinner";

const MessageContainer = () => {
  const { authUser } = useAuthContext();
  const { generatingResume } = useChatContext();

  return (
    <div className="w-[700px] flex flex-col border-r border-slate-500 p-4 flex flex-col">
      {generatingResume ? (
        <div className="flex flex-col justify-center items-center h-full text-white">
          <Spinner animation="grow" />
          <p className="text-lg mb-4">
            We are generating your resume... Sit tight!
          </p>
        </div>
      ) : (
        <>
          <div className="divider px-3">
            {authUser ? `Welcome, ${authUser.name}` : "Welcome"}
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};
export default MessageContainer;
