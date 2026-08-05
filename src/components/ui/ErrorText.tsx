export function ErrorText({ message }: { message?: string | null }) {
  if (!message) return null;
  return <p className="text-xs text-blush-500 bg-blush-50 rounded-lg px-3 py-2">{message}</p>;
}
