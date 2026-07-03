import { useEffect, useMemo, useState } from "react";
import type { UploadStatus } from "../types";
import type { CloudinaryUploadResult } from "../cloudinary/UploadWidget";
import {
  ALL_PRESETS,
  buildOriginalPreview,
  getPresetById,
} from "../lib/transformations";
import { warmAllTransformations } from "../lib/warmup";
import type { CloudinaryImage } from "@cloudinary/url-gen/index";

export function useHeadshot() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [readyUrls, setReadyUrls] = useState<Set<string>>(new Set());

  const handleUploadStart = () => {
    setUploadStatus("uploading");
    setUploadError(null);
  };

  const handleUploadSuccess = (result: CloudinaryUploadResult) => {
    if (result.resource_type !== "image") {
      setUploadStatus("error");
      setUploadError("Please upload an image file (JPG, PNG, or WEBP).");
      return;
    }
    setPublicId(result.public_id);
    setSelectedPresetId(null);
    setReadyUrls(new Set());
    setUploadStatus("success");
    setUploadError(null);
  };

  const handleUploadError = (error: Error) => {
    setUploadStatus("error");
    setUploadError(error.message);
  };

  const originalImage = useMemo(() => {
    if (!publicId) return null;
    return buildOriginalPreview(publicId);
  }, [publicId]);

  const presetImages = useMemo(() => {
    if (!publicId) return [];
    return ALL_PRESETS.map((preset) => ({
      preset,
      image: preset.build(publicId),
    }));
  }, [publicId]);

  useEffect(() => {
    if (presetImages.length === 0) return;
    const urls = presetImages.map(({ image }) => image.toURL());
    warmAllTransformations(urls, (url, ready) => {
      if (!ready) return;
      setReadyUrls((prev) => new Set(prev).add(url));
    });
  }, [presetImages]);

  const selectedPreset = selectedPresetId
    ? (getPresetById(selectedPresetId) ?? null)
    : null;

  const selectedImage: CloudinaryImage | null = useMemo(() => {
    if (!publicId || !selectedPreset) return null;
    return selectedPreset.build(publicId);
  }, [publicId, selectedPreset]);

  return {
    uploadError,
    uploadStatus,
    handleUploadError,
    handleUploadStart,
    handleUploadSuccess,
    originalImage,
    presetImages,
    hasUpload: Boolean(publicId),
    selectPreset: setSelectedPresetId,
    selectedPresetId,
    selectedImage,
    selectedPreset,
    publicId,
    readyUrls,
  };
}