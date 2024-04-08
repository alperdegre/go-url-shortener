import { useRouteError } from "react-router-dom";
import Container from "../layout/container";

export default function ErrorPage() {
  const error: any = useRouteError();

  return (
    <Container>
      <div
        id="error-page"
        className="mx-auto pt-20 flex items-center justify-center"
      >
        <div className="border w-3/5 border-slate-300 rounded-md p-6 mt-10 flex flex-col gap-2">
          <h1 className="tracking-wider text-3xl text-center">Oops!</h1>
          <p className="text-sm tracking-wide text-center">Sorry, an unexpected error has occurred.</p>
          <p className="text-center font-semibold">
            <i>{error.statusText || error.message}</i>
          </p>
        </div>
      </div>
    </Container>
  );
}
