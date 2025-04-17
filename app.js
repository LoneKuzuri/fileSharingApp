document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const uploadButton = document.getElementById("uploadButton");
  const shareableLink = document.getElementById("shareableLink");
  const filePreview = document.getElementById("filePreview");

  // 🔄 Clear preview on page load
  filePreview.innerHTML = "";
fileInput.value= "";
  // ✅ FILE PREVIEW HANDLER
  fileInput.addEventListener("change", () => {
    filePreview.innerHTML = ""; // Clear previous preview
    const file = fileInput.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = "200px";
      filePreview.appendChild(img);
    } else {
      const info = document.createElement("p");
      info.textContent = `Selected file: ${file.name}`;
      filePreview.appendChild(info);
    }
  });

  // ✅ UPLOAD BUTTON CLICK HANDLER
  uploadButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
      shareableLink.textContent = "Please upload a file to share:";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    uploadButton.disabled = true;
    uploadButton.textContent = "Sharing...";

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.link) {
        shareableLink.innerHTML = `<p>File uploaded! 
          <a href="${data.link}" target="_blank" rel="noopener noreferrer">Click here to download</a></p>`;
      } else {
        shareableLink.textContent = "❌ File share failed. Please try again.";
      }
    } catch (error) {
      console.error("Error:", error);
      shareableLink.textContent = "⚠️ An error occurred. Please try again.";
    } finally {
      uploadButton.disabled = false;
      uploadButton.textContent = "Share";
      filePreview.innerHTML = ""; // Clear preview after upload
    }
  });
});
