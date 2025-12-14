import { createWorker } from "tesseract.js";

class App {
  inp: HTMLInputElement;
  out: HTMLElement;
  constructor() {
    this.inp = document.querySelector("#file") as HTMLInputElement;
    this.out = document.querySelector("#out") as HTMLElement;
    this.tesseract();
  }

  async tesseract() {
    const worker = await createWorker("rus+eng");

    await worker.load();

    this.inp.onchange = async () => {
      if(!this.inp.files?.[0]) return
      const {data} = await worker.recognize(this.inp.files[0])
      this.out.textContent = data.text
    }
  }
}

new App();
