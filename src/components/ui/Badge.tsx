export default function Badge({ text }: { text: string }) {
  return (
    <span className="
      text-xs
      px-2 py-1
      rounded-full
      bg-[#16162A]
      text-[#A855F7]
      border border-[#7C3AED]/30
    ">
      {text}
    </span>
  );
}