import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/lib/icons";

function Home() {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-normal pb-2">
        What is{" "}
        <span className="font-semibold">
          <span className="text-golang">GO</span> Url Shortener
        </span>{" "}
        ?
      </h1>
      <p className="tracking-wide pb-2">
        <span className="text-golang">GO</span> Url Shortener is a{" "}
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
      <div className="flex gap-6 pt-2 justify-end">
        <a
          href="https://github.com/alperdegre"
          target="_blank"
          className="hover:bg-golang/20 p-2 cursor-pointer rounded-md group transition duration-500"
        >
          <GithubIcon className="fill-slate-800 group-hover:fill-golang h-6 w-6 transition duration-500" />
        </a>
        <a
          href="https://linkedin.com/in/alper-degre"
          target="_blank"
          className="hover:bg-golang/20 p-2 cursor-pointer rounded-md group transition duration-500"
        >
          <LinkedinIcon className="fill-slate-800 group-hover:fill-golang h-6 w-6 transition duration-500" />
        </a>
        <a
          href="https://x.com/alper_degre"
          target="_blank"
          className="hover:bg-golang/20 p-2 cursor-pointer rounded-md group transition duration-500"
        >
          <TwitterIcon className="fill-slate-800 group-hover:fill-golang h-6 w-6 transition duration-500" />
        </a>
      </div>
    </div>
  );
}

export default Home;
