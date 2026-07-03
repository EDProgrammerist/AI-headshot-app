import { AdvancedImage, lazyload, placeholder } from "@cloudinary/react";
import { Hero } from "../components/Hero";
import UploadCard from "../components/UploadCard";
import { useHeadshot } from "../hooks/use-headshot";
import TransformationGrid from "../components/TransformationGrid";
import ResultPreview from "../components/ResultPreview";
import ExportActions from "../components/ExportActions";

export default function Home() {
  const headshot = useHeadshot();
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="text-lg font-bold">
          <span>
            AI <span className="text-indigo-400">Headshot</span>
          </span>
        </div>
      </header>

      <Hero />

      <UploadCard
        uploadStatus={headshot.uploadStatus}
        uploadError={headshot.uploadError}
        onUploadError={headshot.handleUploadError}
        onUploadStart={headshot.handleUploadStart}
        onUploadSuccess={headshot.handleUploadSuccess}
      />

      {headshot.hasUpload && headshot.originalImage && (
        <section className="px-4 py-8">
          <div className="mx-auto max-w-md text-center">
            <h2 className="mb-4 text-xl font-semibold">Original Upload</h2>
            <AdvancedImage
              cldImg={headshot.originalImage}
              plugins={[placeholder({ mode: "blur" }), lazyload()]}
              alt="Original Upload"
              className="mx-auto rounded-xl shadow-lg"
            />
          </div>
        </section>
      )}

      {headshot.hasUpload && (
        <TransformationGrid
  title="AI Headshot Styles"
  presets={headshot.presetImages}
  selectedPresetId={headshot.selectedPresetId}
  onSelect={headshot.selectPreset}
  readyUrls={headshot.readyUrls}
/>
      )}

      {headshot.hasUpload && (
        <ResultPreview
          originalImage={headshot.originalImage}
          selectedImage={headshot.selectedImage}
          selectedPreset={headshot.selectedPreset}
        />
      )}

      {headshot.hasUpload && headshot.publicId && headshot.selectedPreset && (
        <ExportActions
          publicId={headshot.publicId}
          selectedPreset={headshot.selectedPreset}
        />
      )}
    </div>
  );
}