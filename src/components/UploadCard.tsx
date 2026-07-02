import { ImageIcon } from "lucide-react";


export default function UploadCard() {
    const uploadFile = async (file: File) => {
      try {
      } catch (error) {
            console.error(error);
      }
    };
    <section id="upload" className="px-4 py-12">
        <div className="mx-auto max-w-2xl">
           <h2 className="mb-2 text-center text-2xl font-semi">Upload Your Selfie</h2>
           <p className="mb-8 text-center text-white/60">Drag, drop, or click to upload your photo</p>

           <div className="glass-card relative flex cursor-pointer flex-col items-center gap-6 p-10 transition">
            <input />
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
               <ImageIcon className="h-10 w-10" />
            </div>

            <div className="text-center">
                <p className="text-lg font-medium">Drag & drop your selfie here</p>
                <p className="mt-1 text-sm text-white/50">
                  or click to browse · JPG, PNG, or WEBP
                </p>
            </div>
           </div>
        </div>
    </section>
    );
}