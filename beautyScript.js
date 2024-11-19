// DOM Element References
const imageInput = document.getElementById("imageInput");
const uploadedImage = document.getElementById("uploadedImage");
const thirdsOverlay = document.getElementById("thirdsOverlay");
const spiralOverlayLBC = document.getElementById("spiralOverlayLBC");
const spiralOverlayRBC = document.getElementById("spiralOverlayRBC");
const spiralOverlayLUC = document.getElementById("spiralOverlayLUC");
const spiralOverlayRUC = document.getElementById("spiralOverlayRUC");
const dropArea = document.getElementById("drop-area");
const clearButton = document.getElementById("clear-button");

// Visibility Flags for Overlays
let showThirds = false;
let showSpiralLBC = false;
let showSpiralRBC = false;
let showSpiralLUC = false;
let showSpiralRUC = false;

// Toggle Visibility for Rule of Thirds Overlay
function toggleThirds() {
  showThirds = !showThirds;
  thirdsOverlay.style.display = showThirds ? "block" : "none";
}

// Toggle Visibility for Spiral Overlays (one for each corner)
function toggleSpiralLBC() {
  showSpiralLBC = !showSpiralLBC;
  spiralOverlayLBC.style.display = showSpiralLBC ? "block" : "none";
  showSpiralLBC ? drawFibonacciSpiralLBC() : (spiralOverlayLBC.innerHTML = "");
}

function toggleSpiralRBC() {
  showSpiralRBC = !showSpiralRBC;
  spiralOverlayRBC.style.display = showSpiralRBC ? "block" : "none";
  showSpiralRBC ? drawFibonacciSpiralRBC() : (spiralOverlayRBC.innerHTML = "");
}

function toggleSpiralLUC() {
  showSpiralLUC = !showSpiralLUC;
  spiralOverlayLUC.style.display = showSpiralLUC ? "block" : "none";
  showSpiralLUC ? drawFibonacciSpiralLUC() : (spiralOverlayLUC.innerHTML = "");
}

function toggleSpiralRUC() {
  showSpiralRUC = !showSpiralRUC;
  spiralOverlayRUC.style.display = showSpiralRUC ? "block" : "none";
  showSpiralRUC ? drawFibonacciSpiralRUC() : (spiralOverlayRUC.innerHTML = "");
}

// Prevent default drag and drop behaviors
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Handle File Upload Process
function handleFileUpload(file) {
  if (file) {
    // Reset all overlay visibility flags
    resetOverlayVisibility();

    const reader = new FileReader();
    reader.onload = function (e) {
      // Display uploaded image
      uploadedImage.src = e.target.result;
      uploadedImage.style.display = "block";

      // Hide drop area after image upload
      dropArea.style.display = "none";

      // Wait for image to load before drawing overlays
      uploadedImage.onload = function () {
        drawThirds();

        // Restore thirds overlay visibility if it was previously shown
        thirdsOverlay.style.display = showThirds ? "block" : "none";
      };
    };
    reader.readAsDataURL(file);
  }
}

// Reset all overlay visibility states
function resetOverlayVisibility() {
  // Reset visibility flags
  showThirds = false;
  showSpiralLBC = false;
  showSpiralRBC = false;
  showSpiralLUC = false;
  showSpiralRUC = false;

  // Hide all overlays
  thirdsOverlay.style.display = "none";
  spiralOverlayLBC.style.display = "none";
  spiralOverlayRBC.style.display = "none";
  spiralOverlayLUC.style.display = "none";
  spiralOverlayRUC.style.display = "none";
}

// Drag and Drop Event Listeners
function setupDropAreaListeners() {
  // Prevent default drag behaviors
  dropArea.addEventListener("dragover", preventDefaults);
  dropArea.addEventListener("dragenter", preventDefaults);
  dropArea.addEventListener("dragleave", preventDefaults);

  // Visual feedback during drag
  dropArea.addEventListener("dragenter", () => {
    dropArea.classList.add("drag-over");
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("drag-over");
  });

  // Handle file drop
  dropArea.addEventListener("drop", (e) => {
    preventDefaults(e);
    dropArea.classList.remove("drag-over");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  });

  // Open file explorer on click
  dropArea.addEventListener("click", () => {
    imageInput.click();
  });
}

// File Input Change Event Listener
function setupFileInputListener() {
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  });
}

// Clear Button Event Listener
function setupClearButtonListener() {
  clearButton.addEventListener("click", () => {
    // Reset uploaded image
    uploadedImage.src = "";
    uploadedImage.style.display = "none";

    // Clear overlay contents
    thirdsOverlay.innerHTML = "";
    spiralOverlayLBC.innerHTML = "";
    spiralOverlayRBC.innerHTML = "";
    spiralOverlayLUC.innerHTML = "";
    spiralOverlayRUC.innerHTML = "";

    // Reset visibility states
    resetOverlayVisibility();

    // Reset file input
    imageInput.value = "";

    // Show drop area again
    dropArea.style.display = "block";
  });
}

// Draw Rule of Thirds Overlay
function drawThirds() {
  const width = uploadedImage.width;
  const height = uploadedImage.height;

  // Create SVG with third lines and animation
  thirdsOverlay.innerHTML = `
    <style>
      @keyframes drawVertical {
        from { stroke-dashoffset: ${height}; }
        to { stroke-dashoffset: 0; }
      }

      @keyframes drawHorizontal {
        from { stroke-dashoffset: ${width}; }
        to { stroke-dashoffset: 0; }
      }

      .vertical-line {
        stroke-dasharray: ${height};
        stroke-dashoffset: ${height};
        animation: drawVertical 0.5s linear forwards;
      }
      .horizontal-line {
        stroke-dasharray: ${width};
        stroke-dashoffset: ${width};
        animation: drawHorizontal 0.5s linear forwards;
      }
      .line-1 { animation-delay: 0s; }  
      .line-2 { animation-delay: 0.2s; }  
      .line-3 { animation-delay: 0.4s; }  
      .line-4 { animation-delay: 0.6s; }  
    </style>

    <!-- Horizontal Lines -->
    <line class="horizontal-line line-1" x1="0" y1="${height / 3}" x2="${width}" y2="${height / 3}" />
    <line class="horizontal-line line-2" x1="0" y1="${(2 * height) / 3}" x2="${width}" y2="${(2 * height) / 3}" />

    <!-- Vertical Lines -->
    <line class="vertical-line line-3" x1="${width / 3}" y1="0" x2="${width / 3}" y2="${height}" />
    <line class="vertical-line line-4" x1="${(2 * width) / 3}" y1="0" x2="${(2 * width) / 3}" y2="${height}" />
  `;

  // Set the viewBox to match the image dimensions
  thirdsOverlay.setAttribute("viewBox", `0 0 ${width} ${height}`);
}

// Utility function to create a delay
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Draw Fibonacci Spiral with Configurable Parameters
async function drawFibonacciSpiral(options) {
  const {
    startX,
    startY,
    spiralOverlay,
    sweepFlag,
    xDirectionMultiplier = 1,
    yDirectionMultiplier = 1
  } = options;

  const width = uploadedImage.width;
  const height = uploadedImage.height;

  const golden = (1 + Math.sqrt(5)) / 2;
  let radius = Math.max(width, height) / golden;

  const rotationX = 0;
  const largeArcFlag = 0;

  let x = startX;
  let y = startY;
  let nextX = x;
  let nextY = y;
  let path = `M ${x} ${y}`; // Start at the specified corner

  for (let i = 1; i < 11; i++) {
    // Calculate X movement
    nextX += xDirectionMultiplier * (
      i % 4 === 1 || i % 4 === 2
        ? width / Math.pow(golden, i)
        : (width / Math.pow(golden, i)) * -1
    );

    // Calculate Y movement
    if (i === 1) {
      nextY = yDirectionMultiplier === 1 
        ? y + height
        : y - height;
    } else {
      nextY += yDirectionMultiplier * (
        i % 4 === 2 || i % 4 === 3
          ? (width / Math.pow(golden, i)) * -1
          : width / Math.pow(golden, i)
      );
    }

    // Draw arc
    path += ` A ${radius} ${radius} ${rotationX} ${largeArcFlag} ${sweepFlag} ${nextX} ${nextY}`;
    
    // Update spiral overlay
    spiralOverlay.innerHTML = `<path d="${path}" fill="none" stroke="red" stroke-width="2" />`;
    spiralOverlay.setAttribute("viewBox", `0 0 ${width} ${height}`);

    await sleep(100); // delay between iterations
    radius /= golden;
  }
}

// Convenience functions for drawing spirals in each corner
async function drawFibonacciSpiralLBC() {
  await drawFibonacciSpiral({
    startX: 0,
    startY: uploadedImage.height,
    spiralOverlay: spiralOverlayLBC,
    sweepFlag: 1,
    xDirectionMultiplier: 1,
    yDirectionMultiplier: -1
  });
}

async function drawFibonacciSpiralRBC() {
  await drawFibonacciSpiral({
    startX: uploadedImage.width,
    startY: uploadedImage.height,
    spiralOverlay: spiralOverlayRBC,
    sweepFlag: 0,
    xDirectionMultiplier: -1,
    yDirectionMultiplier: -1
  });
}

async function drawFibonacciSpiralLUC() {
  await drawFibonacciSpiral({
    startX: 0,
    startY: 0,
    spiralOverlay: spiralOverlayLUC,
    sweepFlag: 0,
    xDirectionMultiplier: 1,
    yDirectionMultiplier: 1
  });
}

async function drawFibonacciSpiralRUC() {
  await drawFibonacciSpiral({
    startX: uploadedImage.width,
    startY: 0,
    spiralOverlay: spiralOverlayRUC,
    sweepFlag: 1,
    xDirectionMultiplier: -1,
    yDirectionMultiplier: 1
  });
}

// Initialize event listeners
function init() {
  setupDropAreaListeners();
  setupFileInputListener();
  setupClearButtonListener();
}

// Start the application
init();