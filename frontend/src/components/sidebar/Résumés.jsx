import { useSidebarContext } from "../../context/SidebarContex";
import { useChatContext } from "../../context/ChatContext";
import { extractTime } from "../../utils/extractTime";
import ResumeSVG from "../../assets/resume.svg";

const Résumés = () => {
  const { conversations, loading } = useSidebarContext();
  const { chatId, handleGetResume } = useChatContext();

  const resumes =
    conversations.filter((conversation) => conversation._id === chatId)[0]
      ?.resumes || [];

  const handleResumeClick = async (resumeId) => {
    handleGetResume(resumeId);
  };

  return (
    <div className="py-2">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {resumes.length === 0 && !loading && (
            <p className="text-center">Select a chat to view resumes</p>
          )}
          <div className="flex overflow-x-auto  hide-scrollbar">
            {resumes.map((resume) => (
              <div
                className="rounded-lg hover:bg-gray-700 flex flex-col items-center p-1 m-0 cursor-pointer"
                key={resume._id}
                onClick={() => handleResumeClick(resume._id)}
              >
                <img src={ResumeSVG} alt="File" className="w-10 h-10" />
                <span style={{ fontSize: "0.7rem" }}>
                  {new Date(resume.createdAt).toLocaleDateString()}
                </span>
                <span className="text-gray-400" style={{ fontSize: "0.6rem" }}>
                  {extractTime(new Date(resume.createdAt))}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
export default Résumés;
