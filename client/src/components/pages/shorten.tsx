import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthContext } from "@/context/authContext";
import { BASE_URL } from "@/lib/utils";
import { APIError, UrlResponse } from "@/lib/types";

const urlSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
});

function Shorten() {
  const urlForm = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });
  const [error, setError] = useState("");
  const [shortenedURL, setShortenedURL] = useState("");
  const [copying, setCopying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [error]);

  const url = urlForm.getValues("url");

  useEffect(() => {
    setShortenedURL("");
  }, [url]);

  async function onSubmit(values: z.infer<typeof urlSchema>) {
    if (!token) return;

    setSubmitting(true);
    const response = await fetch(`${BASE_URL}/api/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errResponse: APIError = await response.json();
      setError(errResponse.error);
    } else {
      const data: UrlResponse = await response.json();
      setShortenedURL(`${BASE_URL}/${data.url}`);
    }
    setSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-normal tracking-wider">
        SHORTEN A <span className="text-golang font-semibold">URL</span>
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
            Paste your long URL below to shorten it.
          </p>
        )}
      </motion.div>
      <div className="px-0 py-4 md:px-4">
        <Form {...urlForm}>
          <form onSubmit={urlForm.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={urlForm.control}
              name="url"
              render={({ field }) => (
                <FormItem className="space-y-0 h-[81px]">
                  <FormLabel className="pb-1">URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a URL" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs pl-2 py-1" />
                </FormItem>
              )}
            />
            <div className="pt-2 flex items-center gap-6 flex-col-reverse md:flex-row">
              <div className="flex w-full md:w-min justify-start md:justify-center items-center gap-6">
                <Button type="submit" className={"w-full"} variant={"golang"} disabled={submitting}>
                  {submitting ? "SHORTENING" : "SHORTEN"}
                </Button>
              </div>
              <div className="flex-1 w-full items-center text-center">
                {shortenedURL && (
                  <motion.div
                    key={copying ? "copying" : shortenedURL}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-2 items-center cursor-pointer w-full flex-1 justify-center"
                  >
                    {copying ? (
                      <p className="text-xs sm:text-sm w-max text-center">
                        Copied to Clipboard
                      </p>
                    ) : (
                      <>
                        <p
                          className="text-xs sm:text-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(shortenedURL);
                            setCopying(true);
                            setTimeout(() => setCopying(false), 1000);
                          }}
                        >{`Click to Copy \u2014`}</p>
                        <a
                          href={shortenedURL}
                          target="_blank"
                          className="tracking-wider text-golang text-xs sm:text-sm md:text-md"
                        >
                          {shortenedURL}
                        </a>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Shorten;
