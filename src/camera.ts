import { OCRWorker } from "./ocrWorker";

export class Camera {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  snap: HTMLButtonElement;
  out_camera: HTMLElement;

  constructor(out: HTMLElement) {
    this.video = document.getElementById("video") as HTMLVideoElement;
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.snap = document.getElementById("snap") as HTMLButtonElement;
    this.out_camera = out;

    this.startCamera();
    this.click();
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } },
      });
      this.video.srcObject = stream;
    } catch (err) {
      console.error("Ошибка доступа к камере", err);
    }
  }

  click() {
    this.snap.addEventListener("click", async () => {
      const ctx = this.canvas.getContext("2d")!;
      ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

      this.canvas.toBlob(async (blob) => {
        if (!blob) return;
        this.out_camera.textContent = "Распознаём фото...";
        const text = await OCRWorker.recognize(blob);
        this.out_camera.textContent = text;
      }, "image/jpeg");
    });
  }
}
