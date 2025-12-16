import { OCRWorker } from "./ocrWorker";

function showNotification(message: string) {
  const toast = document.getElementById("notification-toast") as HTMLDivElement;
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function fallbackCopyTextToClipboard(text: string): boolean {
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
  inp: HTMLInputElement;
  out: HTMLElement;

  constructor() {
    this.inp = document.querySelector("#file") as HTMLInputElement;
    this.out = document.querySelector("#out") as HTMLElement;

    this.handleFileUpload();
    this.setupCopyButton();
  }

  handleFileUpload() {
    this.inp.onchange = async () => {
      if (!this.inp.files?.[0]) {
        this.out.textContent = "Ожидание загрузки файла...";
        return;
      }

      this.out.textContent = "Распознаём файл... Подождите немного.";

      const file = this.inp.files[0];
      try {
        const text = await OCRWorker.recognize(file);
        this.out.textContent = text.trim().length < 5 
            ? "Текст не распознан. Попробуйте другое, более четкое изображение." 
            : text;
      } catch (error) {
        console.error("Ошибка распознавания:", error);
        this.out.textContent = "Произошла ошибка при обработке файла.";
      }
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
            textToCopy.includes("Ожидание") ||
            textToCopy.includes("Распознаём") ||
            textToCopy.includes("Ошибка")
          ) {
            showNotification("Нет текста для копирования или идёт обработка.");
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
}

new App();