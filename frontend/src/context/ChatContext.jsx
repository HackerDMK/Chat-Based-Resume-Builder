import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import axios from "../AxiosInstance";
import Modal from "react-bootstrap/Modal";
import {
  MdOutlineDownload,
  MdOutlinePrint,
  MdOutlineReplay,
} from "react-icons/md";

export const ChatContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider = ({ children, initialChatId, userId }) => {
  const chatIdRef = useRef(initialChatId);
  const [chatIdState, setChatIdState] = useState(initialChatId);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [writing, setWriting] = useState(false);
  const [generatingResume, setGeneratingResume] = useState(false);
  const [currentResumeID, setCurrentResumeID] = useState("");
  const [resumehtml, setResumehtml] = useState("");

  const updateChatId = useCallback((newChatId, forceRerender = false) => {
    if (newChatId !== undefined && newChatId !== chatIdRef.current) {
      chatIdRef.current = newChatId;
      window.history.replaceState(null, "", `/${newChatId}`);
      if (forceRerender) {
        setChatIdState(newChatId);
      }
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const fetchedMessages = await getMessages(chatIdState);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatIdState]);

  const getMessages = async (chatId) => {
    try {
      const { data } = await axios.get(
        `chat/${chatId}`
      );
      return data.messages;
    } catch (error) {
      return [];
    }
  };

  const addMessage = useCallback((message) => {
    setMessages((prevMessages) => {
      const newMessage = { ...message };

      if (
        prevMessages.length > 0 &&
        prevMessages[prevMessages.length - 1].role === newMessage.role &&
        !prevMessages[prevMessages.length - 1].isPartial
      ) {
        return [...prevMessages.slice(0, -1), newMessage];
      }

      return [...prevMessages, newMessage];
    });
  }, []);

  const sendMessage = useCallback(
    async (content) => {
      try {
        setWriting(true);
        const messageToSend = {
          _id: Date.now().toString(),
          chat: chatIdRef.current,
          user: userId,
          role: "user",
          content: content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addMessage(messageToSend);

        const botMessageId = Math.random().toString(36).substring(7);
        const initialBotMessage = {
          _id: botMessageId,
          chat: chatIdRef.current,
          user: userId,
          role: "bot",
          content: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPartial: true,
        };
        addMessage(initialBotMessage);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}chat/send/${chatIdRef.current || ""}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify({ message: content }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let fullResponse = "";

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n");

          for (const line of lines) {
            if (line.startsWith("event: chatId")) {
              const newChatId = line.slice(13).trim().split(" ")[1];
              updateChatId(newChatId);
            }
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));
              if (data.type == "text_delta") {
                fullResponse += data.text;
                setMessages((prevMessages) =>
                  prevMessages.map((msg) =>
                    msg._id === botMessageId
                      ? {
                          ...msg,
                          content: fullResponse,
                          isPartial: !data.done,
                          updatedAt: new Date().toISOString(),
                        }
                      : msg
                  )
                );
              }

              if (data.done) {
                setWriting(false);
                return;
              }
            }
          }
        }
      } catch (err) {
        setWriting(false);
        console.error("Error sending message:", err);
      }
    },
    [userId, addMessage, updateChatId]
  );

  const handleGenerateResume = async () => {
    try {
      setGeneratingResume(true);
      const response = await axios.get(
        `chat/generate/${chatIdRef.current}`
      );
      setCurrentResumeID(response.headers["resume-id"]);
      setResumehtml(response.data);
      setGeneratingResume(false);
    } catch (error) {
      setGeneratingResume(false);
      console.error("Failed to generate resume:", error);
    }
  };

  const handleRegenrateResume = async () => {
    setResumehtml("");
    handleGenerateResume();
  };

  const handlePrintResume = () => {
    const printContent = document.querySelector(
      ".resume-modal .modal-body"
    ).innerHTML;
    const originalContent = document.body.innerHTML;

    const modifiedHtml = printContent
      .replace("<body>", `<body style="margin: 0; padding: 0; width: 100%;">`)
      .replace(
        /<p/g,
        `<p style="margin-top: 5pt; margin-bottom: 5pt; padding: 0;"`
      )
      .replace(
        /<li/g,
        `<li style="margin-top: 1pt; margin-bottom: 0pt; padding-top: 0; padding-bottom: 0;"`
      );

    document.body.innerHTML = `
        ${modifiedHtml}
    `;

    const style = document.createElement("style");
    style.innerHTML = `
      @page {
        margin: 0 !important;
      }
      body {
        margin: 40px !important;
        margin-top: 20px !important;
        margin-bottom: 100px !important;
        color: black !important;
      }
    `;
    document.head.appendChild(style);

    window.print();

    document.body.innerHTML = originalContent;
  };

  const handleDownloadResume = async () => {
    try {
      const response = await axios.get(
        `chat/doc/${currentResumeID}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.docx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to download resume:", error);
    }
  };

  const handleGetResume = async (resumeId) => {
    try {
      setCurrentResumeID(resumeId);
      const response = await axios.get(
        `chat/resume/${resumeId}`
      );
      setResumehtml(response.data);
    } catch (error) {
      console.error("Failed to get resume:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        sendMessage,
        chatId: chatIdRef.current,
        updateChatId,
        writing,
        handleGenerateResume,
        generatingResume,
        handleGetResume,
      }}
    >
      <Modal
        show={resumehtml !== ""}
        onHide={() => setResumehtml("")}
        dialogClassName="resume-modal"
        animation={false}
        style={{ opacity: 1, zIndex: 10000, color: "black" }}
      >
        <Modal.Header>
          <button onClick={() => handleRegenrateResume()} className="mx-4">
            <MdOutlineReplay size={25} />
          </button>
          <button onClick={() => handlePrintResume()} className="mx-4">
            <MdOutlinePrint size={25} />
          </button>
          <button onClick={() => handleDownloadResume()} className="mx-4">
            <MdOutlineDownload size={25} />
          </button>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: resumehtml }} />
        </Modal.Body>
      </Modal>
      {children}
    </ChatContext.Provider>
  );
};
