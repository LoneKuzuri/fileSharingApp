document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const uploadButton = document.getElementById("uploadButton");
  const shareableLink = document.getElementById("shareableLink");

  uploadButton.addEventListener("click", async (event) => {
    
    event.preventDefault(); // ✅ Stops refresh
    console.log("Button clicked");  // Log to verify the event is triggered

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
    }
  });
});
