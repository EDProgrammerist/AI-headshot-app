interface WaitOptions {
  intervalMs?: number;
  timeoutMs?: number;
}

function loadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/** Cloudinary returns 423 while a generative transformation is being
 *  computed. Poll until it succeeds (or we give up after timeoutMs). */
export async function waitForTransformation(
  url: string,
  { intervalMs = 2000, timeoutMs = 90000 }: WaitOptions = {},
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await loadImage(url)) return true;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}

/** Kicks off polling for every URL at the same time instead of
 *  one after another, so Cloudinary starts generating all styles
 *  in parallel as soon as the photo is uploaded. */
export function warmAllTransformations(
  urls: string[],
  onSettled: (url: string, ready: boolean) => void,
) {
  urls.forEach((url) => {
    void waitForTransformation(url).then((ready) => onSettled(url, ready));
  });
}