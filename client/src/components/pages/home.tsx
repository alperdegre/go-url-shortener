import { LangContext } from "@/context/langContext";
import { useContext } from "react";
import { Language } from "@/lib/types";
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/lib/icons";

function Home() {
  const { language } = useContext(LangContext)
  return (
    <div className="space-y-1">
      <h1 className="text-lg md:text-2xl font-normal pb-2">
        What is{" "}
        <span className="font-semibold">
          <span className={language === Language.GO ? "text-golang" : "text-python"}>{language === Language.GO ? "GO" : "PYTHON"}</span> URL SHORTENER
        </span>{" "}
        ?
      </h1>
      {language === Language.GO && <>
        <p className="tracking-wide pb-2">
          <span className="text-golang">GO</span> Url Shortener is{" "}
          <i className="text-sm font-bold">- you guessed it -</i> a URL shortener
          made with <span className="text-golang">Go</span>.
        </p>
        <p className="tracking-wide pl-4">
          I wanted to learn <span className="text-golang">Go</span> so I decided
          to make a URL shortener with it as a first project.
        </p>
        <p className="tracking-wide pl-4">
          At first it was going to be a simple CLI URL shortener. But then I
          decided to make it a fully containerized web app with a React frontend
          using Vite because why not?
        </p>
        <p className="tracking-wide pl-4">
          This project helped me see how some simple concepts like JWT
          authentication, database connections, and routing work in{" "}
          <span className="text-golang">Go</span>. Even though pointers made me
          remember my high school days trying to learn C and C++
        </p>
        <p className="tracking-wide pl-4 pb-2">
          It was a nice change to work with a statically typed language after
          working with JavaScript for so long. I'm looking forward to learning
          more about <span className="text-golang">Go</span> and using it in my
          future projects.
        </p>
        <p className="tracking-wide">
          I hope you enjoy using this app as much as I enjoyed making it! If you
          have any questions or suggestions, feel free to reach out to me on my
          socials.
        </p>
      </>}
      {language === Language.PYTHON && <>
        <p className="tracking-wide pb-2">
          <span className="text-python">Python</span> Url Shortener is{" "}
          <i className="text-sm font-bold">- you guessed it -</i> a URL shortener
          made with <span className="text-python">Python</span>.
        </p>
        <p className="tracking-wide pl-4">
          After i finished this project with <span className="text-golang">Go</span> I also wanted to develop something with <span className="text-python">Python</span> so I decided to challenge myself into making the same backend in  <span className="text-python">Python</span>  as fast as possible
        </p>
        <p className="tracking-wide pl-4">
          Whole backend project took 3.5~4 hours to complete. I had to spend some extra time because i've had no prior knowledge of <span className="text-python">Python</span> beforehand.
        </p>
        <p className="tracking-wide pl-4">
          I thought it would be fitting to learn  <span className="text-python">Python</span> because i work on mostly AI products. But after completing this project, i really liked the DX of Python. Its not as verbose and complicated to implement stuff as Go, and it works much better than TS on backend.
        </p>
        <p className="tracking-wide pl-4 pb-2">
          Developed this project with FastAPI. Libraries like jwt, crypto for hash generation were really easy to implement. Used SQLAlchemy for db related stuff. Loved some features of FastAPI like how dependency injection into routes/routers work.
        </p>
        <p className="tracking-wide">
          I hope you enjoy using this app as much as I enjoyed making it! If you
          have any questions or suggestions, feel free to reach out to me on my
          socials.
        </p>
      </>}

      <div className="flex gap-6 pt-2 justify-end">
        <a
          href="https://github.com/alperdegre"
          target="_blank"
          className={`${language === Language.GO ? "hover:bg-golang/20" : "hover:bg-python/20"} p-2 cursor-pointer rounded-md group transition duration-500`}
        >
          <GithubIcon className={`fill-slate-800 ${language === Language.GO ? "group-hover:fill-golang" : "group-hover:fill-python"} h-6 w-6 transition duration-500`} />
        </a>
        <a
          href="https://linkedin.com/in/alper-degre"
          target="_blank"
          className={`${language === Language.GO ? "hover:bg-golang/20" : "hover:bg-python/20"} p-2 cursor-pointer rounded-md group transition duration-500`}
        >
          <LinkedinIcon className={`fill-slate-800 ${language === Language.GO ? "group-hover:fill-golang" : "group-hover:fill-python"} h-6 w-6 transition duration-500`} />
        </a>
        <a
          href="https://x.com/alper_degre"
          target="_blank"
          className={`${language === Language.GO ? "hover:bg-golang/20" : "hover:bg-python/20"} p-2 cursor-pointer rounded-md group transition duration-500`}
        >
          <TwitterIcon className={`fill-slate-800 ${language === Language.GO ? "group-hover:fill-golang" : "group-hover:fill-python"} h-6 w-6 transition duration-500`} />
        </a>
      </div>
    </div>
  );
}

export default Home;
