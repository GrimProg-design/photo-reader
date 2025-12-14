import { createWorker } from "tesseract.js";

export const OCRWorker = {
  worker: null as any,

  async init() {
    if (!this.worker) {
      this.worker = await createWorker('rus+eng');
      await this.worker.load();
    }
    return this.worker;
  },

  async recognize(fileOrBlob: File | Blob) {
    const worker = await this.init();
    const { data } = await worker.recognize(fileOrBlob);
    return data.text;
  },

  async terminate() {
    if (this.worker) await this.worker.terminate();
  }
};
