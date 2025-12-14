import { OCRWorker } from "./ocrWorker";
import { Camera } from "./camera";

class App {
  inp: HTMLInputElement;
  out: HTMLElement;
  constructor() {
    this.inp = document.querySelector("#file") as HTMLInputElement;
    this.out = document.querySelector("#out") as HTMLElement;

    this.inp.onchange = async () => {
      if (!this.inp.files?.[0]) return;
      const text = await OCRWorker.recognize(this.inp.files[0]);
      this.out.textContent = text;
    };

    new Camera(this.out);
  }
}

new App();
