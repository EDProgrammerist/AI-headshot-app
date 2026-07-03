import type { CloudinaryImage } from "@cloudinary/url-gen/assets/CloudinaryImage";
import type { HeadshotPreset } from "../types";
import { AdvancedImage, placeholder } from "@cloudinary/react";
import { cn } from "../lib/utils";
import { Check, Loader2 } from "lucide-react";

interface PresetImage {
  preset: HeadshotPreset;
  image: CloudinaryImage;
}

interface TransformationGridProps {
  title: string;
  presets: PresetImage[];
  selectedPresetId: string | null;
  readyUrls: Set<string>;
  onSelect: (id: string) => void;
}

function PresetCard({
  preset,
  image,
  isSelected,
  isReady,
  onSelect,
}: {
  preset: HeadshotPreset;
  image: CloudinaryImage;
  isSelected: boolean;
  isReady: boolean;
  onSelect: () => void;
}) {
  return (
    <button onClick={onSelect} type="button" disabled={!isReady}>
      <div
        className={cn(
          "relative aspect-[4/5] w-full overflow-hidden bg-black/30 border-1 rounded-xl",
          isSelected ? "border-indigo-500" : "border-transparent",
        )}
      >
        {isReady ? (
          <AdvancedImage
            cldImg={image}
            plugins={[placeholder({ mode: "blur" })]}
            alt={preset.name}
            className="mx-auto rounded-xl shadow-lg"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/50">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-xs">Generating…</span>
          </div>
        )}

        {isSelected && (
          <div className="absolute right-2 top-2 rounded-full bg-indigo-600 p-1">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-semibold">{preset.name}</h4>
        <p className="mt-1 text-xs text-white/50">{preset.description}</p>
      </div>
    </button>
  );
}

export default function TransformationGrid({
  title,
  presets,
  onSelect,
  selectedPresetId,
  readyUrls,
}: TransformationGridProps) {
  if (presets.length === 0) return null;

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-2 text-center text-2xl font-semibold">{title}</h2>
        <p className="mb-8 text-center text-sm text-white/50">
          Outfit swap · Background replace · Optimized for web
        </p>
        <p className="mb-6 text-center text-xs text-amber-400/70">
          All styles generate together in the background (~30–60s total).
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {presets.map(({ preset, image }) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              image={image}
              isSelected={selectedPresetId === preset.id}
              isReady={readyUrls.has(image.toURL())}
              onSelect={() => onSelect(preset.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}