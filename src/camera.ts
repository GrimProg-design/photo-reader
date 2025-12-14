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
      
      const max_width = 1000;
      const scale = Math.min(max_width / this.video.videoWidth, 1);
      this.canvas.width = this.video.videoWidth * scale;
      this.canvas.height = this.video.videoHeight * scale;
      ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

      const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const bw = avg > 128 ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = bw;
      }
      ctx.putImageData(imageData, 0, 0);

      this.canvas.toBlob(async (blob) => {
        if (!blob) return;
        this.out_camera.textContent = "Распознаём фото...";
        const text = await OCRWorker.recognize(blob);
        this.out_camera.textContent = text;
      }, "image/jpeg");
    });
  }
}
