export default function Timer({ secondsLeft }) {
  const min = Math.floor(secondsLeft / 60);
  const sec = secondsLeft % 60;

  return (
    <div className="rounded bg-slate-900 px-4 py-2 text-white">
      Time Left: {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}
    </div>
  );
}
