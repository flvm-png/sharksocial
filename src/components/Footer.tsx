export default function Footer() {
  return (
    <footer
      className="
        mt-16
        border-t border-white/10
        bg-black/10
        backdrop-blur-xl
      "
    >
      <div className="
        max-w-6xl mx-auto
        px-4 py-6
        text-center text-sm text-zinc-400
      ">
        <p>
          <a
            href="https://www.sharkcoders.pt/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              text-zinc-300
              hover:text-[#A855F7]
              transition
            "
          >
            SHARKCODERS
          </a>{" "}
          <span className="text-zinc-500">© {new Date().getFullYear()}</span>
        </p>
      </div>
    </footer>
  );
}