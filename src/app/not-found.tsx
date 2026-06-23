import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold">
        404
      </h1>

      <p className="mt-4">
        Página não encontrada
      </p>

      <Link
        href="/"
        className="text-blue-600 mt-4 inline-block"
      >
        Voltar
      </Link>
    </div>
  );
}