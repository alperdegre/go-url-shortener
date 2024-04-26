import { APIError, Language, URL } from "@/lib/types";
import { CopyIcon, Trash } from "lucide-react";
import { useContext, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "@/context/authContext";
import { LangContext } from "@/context/langContext";

interface Props {
  url: URL;
  ix: number;
  onError: (error: string) => void;
}

function LinkRow({ url, ix, onError }: Props) {
  const [copying, setCopying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { token } = useContext(AuthContext);
  const { serverUrl, language } = useContext(LangContext);

  const handleDelete = async () => {
    if (!token) return;
    setDeleting(true);

    const response = await fetch(`${serverUrl}/api/delete/${url.ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errResponse: APIError = await response.json();
      onError(errResponse.error);
      setDeleting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={url.LongURL + deleting}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {deleting ? null : (
          <div
            className={`flex w-full items-center justify-between py-1 rounded-md ${ix % 2 === 0 && `${language === Language.GO ? "bg-golang/10" : "bg-python/10"}`
              }`}
          >
            <div className="w-[65%] md:w-[75%] flex items-center flex-col-reverse md:flex-row">

              <p className="w-full md:w-[50%] text-xs pl-2">{url.LongURL}</p>
              <a
                href={`${serverUrl}/${url.ShortURL}`}
                target="_blank"
                className={`w-full md:w-[50%] pl-2 md:pl-0 text-xs ${language === Language.GO ? "text-golang" : "text-python"} font-semibold`}
              >
                {serverUrl}/{url.ShortURL}
              </a>
            </div>
            <div className="w-[35%] md:w-[25%] flex items-center">
              <motion.div
                key={url.ShortURL + copying}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full text-center flex items-center justify-center cursor-pointer"
              >
                {copying ? (
                  <p className="text-xs w-max text-center">Copied</p>
                ) : (
                  <p
                    className="w-full flex items-center justify-center group"
                    onClick={() => {
                      setCopying(true);
                      navigator.clipboard.writeText(
                        `${serverUrl}/${url.ShortURL}`
                      );
                      setTimeout(() => setCopying(false), 1000);
                    }}
                  >
                    <CopyIcon className={`w-4 h-4 ${language === Language.GO ? "group-hover:text-golang" : "group-hover:text-python"} transition duration-300`} />
                  </p>
                )}
              </motion.div>
              <p
                className="w-full text-center flex items-center justify-center group cursor-pointer"
                onClick={() => handleDelete()}
              >
                <Trash className={`w-4 h-4 ${language === Language.GO ? "group-hover:text-golang" : "group-hover:text-python"} transition duration-300`} />
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default LinkRow;
