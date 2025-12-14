import { OCRWorker } from "./ocrWorker";
import { Camera } from "./camera";

class App {
  camera: HTMLDivElement;
  upload: HTMLDivElement;
  inp: HTMLInputElement;
  out: HTMLElement;
  camera_i: HTMLButtonElement;
  upload_i: HTMLButtonElement;
  choise: number;
  
  outForCamera: HTMLElement;

  constructor() {
    this.camera = document.querySelector(".camera") as HTMLDivElement;
    this.upload = document.querySelector(".upload-file") as HTMLDivElement;

    this.inp = document.querySelector("#file") as HTMLInputElement;
    this.out = document.querySelector("#out") as HTMLElement;
    this.outForCamera = document.querySelector("#out_for_camera") as HTMLElement;

    this.camera_i = document.querySelector(".cam-i") as HTMLButtonElement;
    this.upload_i = document.querySelector(".upload-i") as HTMLButtonElement;

    this.choise = 0;
    this.choiseFunc();

    this.inp.onchange = async () => {
      if (!this.inp.files?.[0]) return;
      this.out.textContent = "Распознаём файл...";
      const text = await OCRWorker.recognize(this.inp.files[0]);
      this.out.textContent = text;
    };

    new Camera(this.outForCamera); 
  }

  choiseFunc() {
    this.camera_i.addEventListener("click", () => {
      this.choise = 1;
      this.upload.classList.add("hidden");
      this.camera.classList.remove("hidden");
      
      this.camera_i.classList.add("active-choice");
      this.upload_i.classList.remove("active-choice");
    });

    this.upload_i.addEventListener("click", () => {
      this.choise = 2;
      this.camera.classList.add("hidden");
      this.upload.classList.remove("hidden");
      
      this.upload_i.classList.add("active-choice");
      this.camera_i.classList.remove("active-choice");
    });
  }
}

new App();