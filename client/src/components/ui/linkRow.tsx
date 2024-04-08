import { APIError, URL } from "@/lib/types";
import { BASE_URL } from "@/lib/utils";
import { CopyIcon, Trash } from "lucide-react";
import { useContext, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "@/context/authContext";

interface Props {
  url: URL;
  ix: number;
  onError: (error: string) => void;
}

function LinkRow({ url, ix, onError }: Props) {
  const [copying, setCopying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { token } = useContext(AuthContext);

  const handleDelete = async () => {
    if (!token) return;
    setDeleting(true);

    const response = await fetch(`${BASE_URL}/api/delete/${url.ID}`, {
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
            className={`flex w-full items-center py-1 rounded-md ${
              ix % 2 === 0 && "bg-golang/10"
            }`}
          >
            <p className="w-[45%] text-xs pl-2">{url.LongURL}</p>
            <a
              href={`${BASE_URL}/${url.ShortURL}`}
              target="_blank"
              className="w-[40%] text-xs text-golang font-semibold"
            >
              {BASE_URL}/{url.ShortURL}
            </a>
            <motion.div
              key={url.ShortURL + copying}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-[8%] text-center flex items-center justify-center cursor-pointer"
            >
              {copying ? (
                <p className="text-xs w-max text-center">Copied</p>
              ) : (
                <p
                  className="w-full flex items-center justify-center group"
                  onClick={() => {
                    setCopying(true);
                    navigator.clipboard.writeText(
                      `${BASE_URL}/${url.ShortURL}`
                    );
                    setTimeout(() => setCopying(false), 1000);
                  }}
                >
                  <CopyIcon className="w-4 h-4 group-hover:text-golang transition duration-300" />
                </p>
              )}
            </motion.div>
            <p
              className="w-[7%] text-center flex items-center justify-center group cursor-pointer"
              onClick={() => handleDelete()}
            >
              <Trash className="w-4 h-4 group-hover:text-golang transition duration-300" />
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default LinkRow;
