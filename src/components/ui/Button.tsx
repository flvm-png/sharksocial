export default function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg"
    >
      {children}
    </button>
  );
}