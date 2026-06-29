export default function Loader({ label = 'Loading', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="text-sm font-semibold text-muted">{label}</p>
    </div>
  );

  if (fullScreen) return <div className="flex min-h-screen items-center justify-center">{content}</div>;
  return content;
}
