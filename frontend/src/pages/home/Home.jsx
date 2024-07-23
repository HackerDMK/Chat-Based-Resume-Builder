import { useParams } from "react-router-dom";
import { ChatContextProvider } from "../../context/ChatContext";
import { SidebarContextProvider } from "../../context/SidebarContex";
import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messages/MessageContainer";

const Home = () => {
  const { chatId: urlChatId } = useParams();

  return (
    <div style={{ zIndex: 100 }}>
      <div className="divider px-3 text-2xl font-bold text-center text-white">
        Chat Based Resume Builder
      </div>
      <div className="flex h-[620px] rounded-lg overflow-hidden bg-white-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 border border-gray-800 shadow-lg">
        <ChatContextProvider initialChatId={urlChatId}>
          <SidebarContextProvider>
            <Sidebar />
            <MessageContainer />
          </SidebarContextProvider>
        </ChatContextProvider>
      </div>
    </div>
  );
};

export default Home;
