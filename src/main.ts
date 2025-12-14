import { OCRWorker } from "./ocrWorker";
import { Camera } from "./camera";

class App {
  camera: HTMLDivElement;
  upload: HTMLDivElement;
  inp: HTMLInputElement;
  out: HTMLElement;
  camera_i: HTMLImageElement;
  upload_i: HTMLImageElement;
  choise: number;
  constructor() {
    this.camera = document.querySelector(".camera") as HTMLDivElement;
    this.upload = document.querySelector(".upload-file") as HTMLDivElement;

    this.inp = document.querySelector("#file") as HTMLInputElement;
    this.out = document.querySelector("#out") as HTMLElement;

    this.camera_i = document.querySelector(".cam-i") as HTMLImageElement;
    this.upload_i = document.querySelector(".upload-i") as HTMLImageElement;

    this.choise = 0;
    this.choiseFunc();

    this.inp.onchange = async () => {
      if (!this.inp.files?.[0]) return;
      const text = await OCRWorker.recognize(this.inp.files[0]);
      this.out.textContent = text;
    };

    new Camera(this.out);
  }

  choiseFunc() {
    this.camera_i.addEventListener("click", () => {
      this.choise = 1;
      this.camera.classList.remove("hidden");
      this.upload.classList.add("hidden");
    });

    this.upload_i.addEventListener("click", () => {
      this.choise = 2;
      this.upload.classList.remove("hidden");
      this.camera.classList.add("hidden");
    });
  }
}

new App();
