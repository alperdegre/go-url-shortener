import { AuthContext } from "@/context/authContext";
import { URL } from "@/lib/types";
import { BASE_URL } from "@/lib/utils";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import LinkRow from "../ui/linkRow";

function Dashboard() {
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
        <div className="flex w-full justify-between items-center pb-2">
          <div className="flex items-center w-[65%] md:w-[75%]"><p className="w-[50%] font-semibold pl-2 hidden md:inline-block">Long URL</p>
            <p className="w-[50%] font-semibold pl-2">Short URL</p></div>
          <div className="w-[35%] md:w-[25%] flex items-center">
            <p className="w-full text-center text-xs md:text-base font-semibold ">Copy</p>
            <p className="w-full text-center text-xs md:text-base font-semibold">Delete</p>
          </div>
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
