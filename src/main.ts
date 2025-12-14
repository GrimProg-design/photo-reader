import { OCRWorker } from "./ocrWorker";
import { Camera } from "./camera";

function showNotification(message: string) {
  const toast = document.getElementById("notification-toast") as HTMLDivElement;
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    document.body.removeChild(textArea);
    console.error("Fallback: Не удалось скопировать текст в буфер обмена", err);
    return false;
  }
}

class App {
  camera: HTMLDivElement;
  upload: HTMLDivElement;
  inp: HTMLInputElement;
  out: HTMLElement;
  camera_i: HTMLButtonElement;
  upload_i: HTMLButtonElement;
  outForCamera: HTMLElement;
  choise: number;
  cameraInstance: Camera;

  constructor() {
    this.camera = document.querySelector(".camera") as HTMLDivElement;
    this.upload = document.querySelector(".upload-file") as HTMLDivElement;

    this.inp = document.querySelector("#file") as HTMLInputElement;
    this.out = document.querySelector("#out") as HTMLElement;
    this.outForCamera = document.querySelector(
      "#out_for_camera"
    ) as HTMLElement;

    this.camera_i = document.querySelector(".cam-i") as HTMLButtonElement;
    this.upload_i = document.querySelector(".upload-i") as HTMLButtonElement;

    this.choise = 0;
    this.cameraInstance = new Camera(this.outForCamera);

    this.choiseFunc();
    this.handleFileUpload();
    this.setupCopyButton();
  }

  handleFileUpload() {
    this.inp.onchange = async () => {
      if (!this.inp.files?.[0]) return;

      this.out.textContent = "Распознаём файл...";

      const file = this.inp.files[0];
      const text = await OCRWorker.recognize(file);
      this.out.textContent = text;
    };
  }

  setupCopyButton() {
    const copyButtons = document.querySelectorAll(".copy-btn");

    copyButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const targetId = (button as HTMLButtonElement).dataset.target;
        if (!targetId) return;

        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const textToCopy = targetElement.textContent || "";

          if (
            textToCopy.trim() === "" ||
            textToCopy.includes("Распознаём") ||
            textToCopy.includes("Выберите способ")
          ) {
            showNotification("Нет текста для копирования.");
            return;
          }

          const success = fallbackCopyTextToClipboard(textToCopy);

          if (success) {
            showNotification("Текст успешно скопирован в буфер обмена!");
          } else {
            showNotification("Ошибка копирования. Попробуйте вручную.");
          }
        }
      });
    });
  }

  showCameraWarning() {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const content = `
      <div class="modal-content">
        <h3>⚠️ Внимание: Функция Камеры</h3>
        <p>Данная функция находится в стадии доработки и может работать некорректно, особенно на некоторых мобильных устройствах.</p>
        <button id="modal-cancel" class="btn btn-white">Отмена</button>
        <button id="modal-confirm" class="btn btn-primary">Продолжить</button>
      </div>
    `;
    overlay.innerHTML = content;
    document.body.appendChild(overlay);

    const closeModal = () => {
      document.body.removeChild(overlay);
      this.camera_i.classList.remove("active-choice");
      this.upload_i.classList.add("active-choice");
    };

    document.getElementById("modal-cancel")?.addEventListener("click", () => {
      this.choise = 2;
      this.upload.classList.remove("hidden");
      this.camera.classList.add("hidden");
      closeModal();
    });

    document.getElementById("modal-confirm")?.addEventListener("click", () => {
      this.choise = 1;
      this.upload.classList.add("hidden");
      this.camera.classList.remove("hidden");
      closeModal();
    });
  }

  choiseFunc() {
    this.camera_i.addEventListener("click", () => {
      this.camera_i.classList.add("active-choice");
      this.upload_i.classList.remove("active-choice");
      this.showCameraWarning();
    });

    this.upload_i.addEventListener("click", () => {
      this.choise = 2;
      this.camera.classList.add("hidden");
      this.upload.classList.remove("hidden");

      this.upload_i.classList.add("active-choice");
      this.camera_i.classList.remove("active-choice");
    });

    this.cameraInstance.onTextRecognized = (text: string) => {
      console.log("Текст распознан и готов к копированию.");
    };
  }
}

new App();
