import Container from "./container";

function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-white text-sm fixed bottom-0 left-0">
      <Container>
        <div className="flex justify-between py-4">
          <div className="flex items-center font-light gap-2">
            <p><span className="text-golang">Go</span> Url Shortener</p>
            <span>{`\u2014`}</span>
            <p>Demo project made by <a href="https://github.com/alperdegre" className="font-bold text-golang">alperdegre</a> to learn <span className="text-golang">Go</span></p>
          </div>
          <div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
