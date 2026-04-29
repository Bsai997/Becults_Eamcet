import ImageUploadButton from "./ImageUploadButton";

export default function JSONInput({ value, onChange, onParse, loading, error }) {
  const handleImageUploaded = (url) => {
    const urlText = `${url}`;
    alert(`Image URL copied: ${urlText}\n\nYou can now paste this URL in your JSON as:\n- question_image_url for question images\n- image_url for option images`);
    // Copy to clipboard
    navigator.clipboard.writeText(urlText);
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">JSON Input</h3>
      <div className="mb-4 rounded bg-blue-50 p-3 border border-blue-200">
        <p className="text-sm font-semibold text-blue-900 mb-2">📸 Upload Images</p>
        <ImageUploadButton onImageUploaded={handleImageUploaded} buttonText="Upload Image" />
        <p className="text-xs text-blue-700 mt-2">Upload images to Cloudinary and copy the URL to your JSON</p>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-60 w-full rounded border p-2 font-mono text-sm focus:outline-none ${error ? 'border-red-500 bg-red-50' : ''}`}
        placeholder="Paste test JSON"
        aria-invalid={!!error}
        aria-describedby={error ? 'json-error' : undefined}
      />
      {error && (
        <div id="json-error" className="mt-2 text-xs text-red-700 font-semibold animate-pulse">
          {error}
        </div>
      )}
      <button
        onClick={onParse}
        disabled={loading}
        className="mt-3 rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50 hover:bg-indigo-700 transition"
      >
        Parse JSON
      </button>
    </div>
  );
}
