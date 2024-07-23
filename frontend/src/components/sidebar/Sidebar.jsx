import Résumés from "./Résumés";
import Chats from "./Chats";
import LogoutButton from "./LogoutButton";
import NewChatButton from "./NewChatButton";
import { AiOutlineReload } from "react-icons/ai";
import { useChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const { generatingResume } = useChatContext();
  return (
    <div className="border-r border-slate-500 p-4 flex flex-col w-[300px]" style={{ pointerEvents: generatingResume ? "none" : "auto", opacity: generatingResume ? 0.5 : 1 }}>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
        className="mb-4 pb-4"
      >
        <div style={{ flex: 1 }}>
          <Chats />
        </div>
        <div className="border-t border-slate-500 py-2 flex flex-col overflow-auto text-center" />
        <div style={{ height: "60px" }}>
          <Résumés />
        </div>
      </div>
      <div className="mt-auto flex justify-between">
        <LogoutButton />
        <div className="mt-auto">
          <AiOutlineReload
            className="w-6 h-6 text-white cursor-pointer"
            onClick={() => window.location.reload()}
          />
        </div>
        <NewChatButton />
      </div>
    </div>
  );
};
export default Sidebar;
