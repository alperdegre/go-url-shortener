import { AuthContext } from "@/context/authContext";
import { URL } from "@/lib/types";
import { BASE_URL } from "@/lib/utils";
import { motion } from "framer-motion";
import { CopyIcon, DeleteIcon, Trash } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import LinkRow from "../ui/linkRow";

function Dashboard() {
  const [submitting, setSubmitting] = useState(false);
  const [urls, setURLs] = useState<URL[]>([]);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    async function fetchURLs() {
      if (!token) return;
      const response = await fetch(`${BASE_URL}/api/get`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errResponse = await response.json();
        setError(errResponse.error);
      } else {
        const urlsResponse = await response.json();
        setURLs(urlsResponse.urls);
      }
    }
    fetchURLs();
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [error]);

  const handleRefetch = async () => {
    if (!token) return;
    const response = await fetch(`${BASE_URL}/api/get`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errResponse = await response.json();
      setError(errResponse.error);
    } else {
      const urlsResponse = await response.json();
      setURLs(urlsResponse.urls);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-normal tracking-wider">
        YOUR <span className="text-golang font-semibold">SHORTENED</span> URLS
      </h2>
      <motion.div
        key={error}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {error ? (
          <p className="text-sm tracking-wider text-destructive">{error}</p>
        ) : (
          <p className="text-sm tracking-wider">
            Check your shortened URLs below.
          </p>
        )}
      </motion.div>
      <div className="p-4 h-[300px] overflow-y-scroll">
        <div className="flex w-full items-center pb-2">
          <p className="w-[45%] font-semibold">Long URL</p>
          <p className="w-[40%] font-semibold">Short URL</p>
          <p className="w-[8%] text-center font-semibold ">Copy</p>
          <p className="w-[7%] text-center font-semibold">Delete</p>
        </div>
        <div className="flex flex-col gap-1">
          {urls.map((url, ix) => {
            console.log(url);
            return (
              <LinkRow
                key={ix}
                url={url}
                ix={ix}
                onError={(error) => setError(error)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
