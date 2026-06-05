import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-neutral-900">Page not found</h1>
      <Link
        href="/"
        className="mt-4 inline-block font-medium text-neutral-900 underline-offset-2 hover:underline"
      >
        Back to catalog
      </Link>
    </div>
  );
}
