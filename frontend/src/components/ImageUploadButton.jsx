import { useState } from "react";
import { api } from "../lib/api";

export default function ImageUploadButton({ onImageUploaded, buttonText = "Upload Image" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/admin/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onImageUploaded(response.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="rounded bg-blue-600 px-3 py-2 text-white cursor-pointer hover:bg-blue-700 disabled:opacity-50 inline-block text-center">
        {loading ? "Uploading..." : buttonText}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={loading}
          className="hidden"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
