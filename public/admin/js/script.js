// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
  uploadImageInput.addEventListener("change", (e) => {
    if(e.target.files.length) {
      const imageFile = URL.createObjectURL(e.target.files[0]);
      uploadImagePreview.src = imageFile;
    }
  });
}
// End Upload Image

// Upload Audio
const uploadAudio = document.querySelector("[upload-audio]");
if (uploadAudio) {
  const uploadAudioInput = uploadAudio.querySelector("[upload-audio-input]");
  const uploadAudioPreview = uploadAudio.querySelector("[upload-audio-preview]");
  const source = uploadAudio.querySelector("source");
  uploadAudioInput.addEventListener("change", (e) => {
    if(e.target.files.length) {
      const audioFile = URL.createObjectURL(e.target.files[0]);
      source.src = audioFile;
      uploadAudioPreview.load(); // load file src trong source
    }
  });
}
// End Upload Audio