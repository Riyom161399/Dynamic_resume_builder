// Initialize Canvas
const canvas = new fabric.Canvas('canvas', {
  backgroundColor: '#ffffff',
  preserveObjectStacking: true,
});

let zoomLevel = 1;
let currentObject = null;
let clipboard = null;
let sidebarCollapsed = false;
let undoStack = [];
let redoStack = [];
let currentCanvasSize = { width: 800, height: 600, name: 'Default' };

// Canvas Events
canvas.on('selection:created', updateProperties);
canvas.on('selection:updated', updateProperties);
canvas.on('selection:cleared', clearProperties);
canvas.on('object:modified', function() {
  updateLayers();
  saveState();
});
canvas.on('object:added', function() {
  updateLayers();
  saveState();
});
canvas.on('object:removed', function() {
  updateLayers();
  saveState();
});

// Right-click context menu
canvas.on('mouse:down', function(options) {
  if (options.e.button === 2) { // Right click
    showContextMenu(options.e);
  } else {
    hideContextMenu();
  }
});

// Prevent default right-click menu
document.addEventListener('contextmenu', function(e) {
  if (e.target.closest('#canvas')) {
    e.preventDefault();
  }
});

// Hide context menu on click elsewhere
document.addEventListener('click', hideContextMenu);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 'c':
        e.preventDefault();
        copyObject();
        break;
      case 'v':
        e.preventDefault();
        pasteObject();
        break;
      case 'd':
        e.preventDefault();
        duplicateObject();
        break;
      case 's':
        e.preventDefault();
        saveProject();
        break;
      case 'z':
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        break;
      case 'a':
        e.preventDefault();
        selectAll();
        break;
    }
  } else if (e.key === 'Delete') {
    deleteObject();
  } else if (e.key === 'Escape') {
    canvas.discardActiveObject();
    canvas.renderAll();
  }
});

// Canvas Size Functions
function showCanvasSizeModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Canvas Size</h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="size-presets">
          <h4>Presets</h4>
          <div class="preset-grid">
            <div class="preset-item" onclick="setCanvasSize(595, 842, 'A4 Portrait')">
              <div class="preset-visual" style="width: 30px; height: 42px;"></div>
              <span>A4 Portrait<br>595 × 842</span>
            </div>
            <div class="preset-item" onclick="setCanvasSize(842, 595, 'A4 Landscape')">
              <div class="preset-visual" style="width: 42px; height: 30px;"></div>
              <span>A4 Landscape<br>842 × 595</span>
            </div>
            <div class="preset-item" onclick="setCanvasSize(421, 595, 'A5 Portrait')">
              <div class="preset-visual" style="width: 25px; height: 35px;"></div>
              <span>A5 Portrait<br>421 × 595</span>
            </div>
            <div class="preset-item" onclick="setCanvasSize(1080, 1080, 'Instagram Post')">
              <div class="preset-visual" style="width: 35px; height: 35px;"></div>
              <span>Instagram Post<br>1080 × 1080</span>
            </div>
            <div class="preset-item" onclick="setCanvasSize(1080, 1350, 'Instagram Story')">
              <div class="preset-visual" style="width: 28px; height: 35px;"></div>
              <span>Instagram Story<br>1080 × 1350</span>
            </div>
            <div class="preset-item" onclick="setCanvasSize(1200, 630, 'Facebook Cover')">
              <div class="preset-visual" style="width: 42px; height: 22px;"></div>
              <span>Facebook Cover<br>1200 × 630</span>
            </div>
            <div class="preset-item" onclick="setCanvasSize(1280, 720, 'YouTube Thumbnail')">
              <div class="preset-visual" style="width: 42px; height: 24px;"></div>
              <span>YouTube Thumb<br>1280 × 720</span>
            </div>
            <div class="preset-item" onclick="setCanvasSize(1024, 512, 'Twitter Header')">
              <div class="preset-visual" style="width: 42px; height: 21px;"></div>
              <span>Twitter Header<br>1024 × 512</span>
            </div>
          </div>
        </div>
        <div class="custom-size">
          <h4>Custom Size</h4>
          <div class="custom-inputs">
            <div class="input-group">
              <label>Width (px)</label>
              <input type="number" id="customWidth" value="${canvas.width}" min="100" max="5000">
            </div>
            <div class="input-group">
              <label>Height (px)</label>
              <input type="number" id="customHeight" value="${canvas.height}" min="100" max="5000">
            </div>
          </div>
          <button class="btn" onclick="setCustomCanvasSize()">Apply Custom Size</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function setCanvasSize(width, height, name) {
  const scale = Math.min(800 / width, 600 / height, 1);
  canvas.setDimensions({
    width: width,
    height: height
  });
  
  currentCanvasSize = { width, height, name };
  
  // Update canvas wrapper size for better display
  const wrapper = document.querySelector('.canvas-wrapper');
  wrapper.style.maxWidth = Math.min(width * scale, 800) + 'px';
  wrapper.style.maxHeight = Math.min(height * scale, 600) + 'px';
  
  canvas.renderAll();
  updateCanvasInfo();
  
  // Close modal if exists
  const modal = document.querySelector('.modal-overlay');
  if (modal) modal.remove();
  
  showNotification(`Canvas size set to ${name} (${width} × ${height})`);
}

function setCustomCanvasSize() {
  const width = parseInt(document.getElementById('customWidth').value);
  const height = parseInt(document.getElementById('customHeight').value);
  
  if (width && height && width >= 100 && height >= 100) {
    setCanvasSize(width, height, 'Custom');
  } else {
    showNotification('Please enter valid dimensions (100-5000px)', 'error');
  }
}

function updateCanvasInfo() {
  const info = document.getElementById('canvasInfo');
  if (info) {
    info.textContent = `${currentCanvasSize.name} - ${currentCanvasSize.width} × ${currentCanvasSize.height}`;
  }
}

// Enhanced Tool Functions
function addText() {
  const text = new fabric.IText('Click to edit text', {
    left: canvas.width / 2 - 50,
    top: canvas.height / 2 - 12,
    fontSize: parseInt(document.getElementById('fontSize').value),
    fill: document.getElementById('fillColor').value,
    fontFamily: document.getElementById('fontFamily').value,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(text);
  canvas.setActiveObject(text);
  text.enterEditing();
}

function addHeading() {
  const heading = new fabric.IText('Your Heading Here', {
    left: canvas.width / 2,
    top: 100,
    fontSize: 48,
    fill: document.getElementById('fillColor').value,
    fontFamily: document.getElementById('fontFamily').value,
    fontWeight: 'bold',
    originX: 'center',
    originY: 'center'
  });
  canvas.add(heading);
  canvas.setActiveObject(heading);
  heading.enterEditing();
}

function addSubheading() {
  const subheading = new fabric.IText('Your Subheading', {
    left: canvas.width / 2,
    top: 180,
    fontSize: 24,
    fill: document.getElementById('fillColor').value,
    fontFamily: document.getElementById('fontFamily').value,
    fontWeight: '600',
    originX: 'center',
    originY: 'center'
  });
  canvas.add(subheading);
  canvas.setActiveObject(subheading);
  subheading.enterEditing();
}

function addRect() {
  const rect = new fabric.Rect({
    left: canvas.width / 2 - 60,
    top: canvas.height / 2 - 40,
    width: 120,
    height: 80,
    fill: document.getElementById('fillColor').value,
    stroke: document.getElementById('strokeColor').value,
    strokeWidth: 2,
    rx: 5,
    ry: 5
  });
  canvas.add(rect);
  canvas.setActiveObject(rect);
}

function addCircle() {
  const circle = new fabric.Circle({
    left: canvas.width / 2 - 50,
    top: canvas.height / 2 - 50,
    radius: 50,
    fill: document.getElementById('fillColor').value,
    stroke: document.getElementById('strokeColor').value,
    strokeWidth: 2
  });
  canvas.add(circle);
  canvas.setActiveObject(circle);
}

function addTriangle() {
  const triangle = new fabric.Triangle({
    left: canvas.width / 2 - 50,
    top: canvas.height / 2 - 50,
    width: 100,
    height: 100,
    fill: document.getElementById('fillColor').value,
    stroke: document.getElementById('strokeColor').value,
    strokeWidth: 2
  });
  canvas.add(triangle);
  canvas.setActiveObject(triangle);
}

function addLine() {
  const line = new fabric.Line([0, 0, 150, 0], {
    left: canvas.width / 2 - 75,
    top: canvas.height / 2,
    stroke: document.getElementById('strokeColor').value,
    strokeWidth: 3,
    strokeLineCap: 'round'
  });
  canvas.add(line);
  canvas.setActiveObject(line);
}

function addArrow() {
  const arrow = new fabric.Group([
    new fabric.Line([0, 0, 100, 0], {
      stroke: document.getElementById('strokeColor').value,
      strokeWidth: 3,
      strokeLineCap: 'round'
    }),
    new fabric.Triangle({
      left: 100,
      top: 0,
      width: 15,
      height: 15,
      fill: document.getElementById('strokeColor').value,
      originX: 'center',
      originY: 'center',
      angle: 90
    })
  ], {
    left: canvas.width / 2 - 50,
    top: canvas.height / 2
  });
  canvas.add(arrow);
  canvas.setActiveObject(arrow);
}

function addStar() {
  const starPoints = [];
  const outerRadius = 40;
  const innerRadius = 20;
  const numPoints = 5;
  
  for (let i = 0; i < numPoints * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / numPoints;
    starPoints.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    });
  }
  
  const star = new fabric.Polygon(starPoints, {
    left: canvas.width / 2,
    top: canvas.height / 2,
    fill: document.getElementById('fillColor').value,
    stroke: document.getElementById('strokeColor').value,
    strokeWidth: 2,
    originX: 'center',
    originY: 'center'
  });
  canvas.add(star);
  canvas.setActiveObject(star);
}

// Enhanced Image Functions
function triggerImageUpload() {
  document.getElementById('imgUpload').click();
}

document.getElementById('imgUpload').addEventListener('change', function(e) {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(event) {
      fabric.Image.fromURL(event.target.result, function(img) {
        // Scale image to fit canvas while maintaining aspect ratio
        const maxWidth = canvas.width * 0.5;
        const maxHeight = canvas.height * 0.5;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        
        img.scale(scale);
        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center'
        });
        
        canvas.add(img);
        canvas.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  });
});

// Background Functions
function addGradientBackground() {
  const gradient = new fabric.Gradient({
    type: 'linear',
    coords: { x1: 0, y1: 0, x2: canvas.width, y2: canvas.height },
    colorStops: [
      { offset: 0, color: '#667eea' },
      { offset: 1, color: '#764ba2' }
    ]
  });
  canvas.setBackgroundColor(gradient, canvas.renderAll.bind(canvas));
}

function addSolidBackground() {
  const color = document.getElementById('fillColor').value;
  canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
}

function removeBackground() {
  canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
}

function addPatternBackground() {
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 50;
  patternCanvas.height = 50;
  const ctx = patternCanvas.getContext('2d');
  
  // Create a simple dot pattern
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, 50, 50);
  ctx.fillStyle = '#e0e0e0';
  ctx.beginPath();
  ctx.arc(25, 25, 3, 0, 2 * Math.PI);
  ctx.fill();
  
  const pattern = new fabric.Pattern({
    source: patternCanvas,
    repeat: 'repeat'
  });
  
  canvas.setBackgroundColor(pattern, canvas.renderAll.bind(canvas));
}

// Property Updates
function updateProperties() {
  const obj = canvas.getActiveObject();
  if (!obj) return;
  
  currentObject = obj;
  
  if (obj.fill && typeof obj.fill === 'string') {
    document.getElementById('fillColor').value = obj.fill;
    document.getElementById('fillColorPreview').style.background = obj.fill;
  }
  
  if (obj.stroke) {
    document.getElementById('strokeColor').value = obj.stroke;
    document.getElementById('strokeColorPreview').style.background = obj.stroke;
  }
  
  if (obj.fontSize) {
    document.getElementById('fontSize').value = obj.fontSize;
    document.getElementById('fontSizeValue').textContent = obj.fontSize + 'px';
  }
  
  if (obj.opacity !== undefined) {
    document.getElementById('opacity').value = obj.opacity;
    document.getElementById('opacityValue').textContent = Math.round(obj.opacity * 100) + '%';
  }
  
  if (obj.fontFamily) {
    document.getElementById('fontFamily').value = obj.fontFamily;
  }
  
  if (obj.strokeWidth !== undefined) {
    document.getElementById('strokeWidth').value = obj.strokeWidth;
    document.getElementById('strokeWidthValue').textContent = obj.strokeWidth + 'px';
  }
}

function clearProperties() {
  currentObject = null;
}

// Property Listeners
document.getElementById('fillColor').addEventListener('input', function() {
  const obj = canvas.getActiveObject();
  if (obj && obj.set) {
    obj.set('fill', this.value);
    document.getElementById('fillColorPreview').style.background = this.value;
    canvas.renderAll();
  }
});

document.getElementById('strokeColor').addEventListener('input', function() {
  const obj = canvas.getActiveObject();
  if (obj && obj.set) {
    obj.set('stroke', this.value);
    document.getElementById('strokeColorPreview').style.background = this.value;
    canvas.renderAll();
  }
});

document.getElementById('fontSize').addEventListener('input', function() {
  const obj = canvas.getActiveObject();
  if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
    obj.set('fontSize', parseInt(this.value));
    document.getElementById('fontSizeValue').textContent = this.value + 'px';
    canvas.renderAll();
  }
});

document.getElementById('opacity').addEventListener('input', function() {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set('opacity', parseFloat(this.value));
    document.getElementById('opacityValue').textContent = Math.round(this.value * 100) + '%';
    canvas.renderAll();
  }
});

document.getElementById('fontFamily').addEventListener('change', function() {
  const obj = canvas.getActiveObject();
  if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
    obj.set('fontFamily', this.value);
    canvas.renderAll();
  }
});

// Zoom Functions
function zoomIn() {
  zoomLevel = Math.min(zoomLevel * 1.1, 5);
  canvas.setZoom(zoomLevel);
  updateZoomLevel();
}

function zoomOut() {
  zoomLevel = Math.max(zoomLevel * 0.9, 0.1);
  canvas.setZoom(zoomLevel);
  updateZoomLevel();
}

function resetZoom() {
  zoomLevel = 1;
  canvas.setZoom(1);
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  updateZoomLevel();
}

function zoomToFit() {
  const objects = canvas.getObjects();
  if (objects.length === 0) return;
  
  canvas.discardActiveObject();
  const group = new fabric.Group(objects);
  const boundingRect = group.getBoundingRect();
  
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  
  const scaleX = (canvasWidth - 100) / boundingRect.width;
  const scaleY = (canvasHeight - 100) / boundingRect.height;
  const scale = Math.min(scaleX, scaleY);
  
  zoomLevel = scale;
  canvas.setZoom(scale);
  
  const centerX = (canvasWidth / 2) / scale;
  const centerY = (canvasHeight / 2) / scale;
  const groupCenterX = boundingRect.left + boundingRect.width / 2;
  const groupCenterY = boundingRect.top + boundingRect.height / 2;
  
  canvas.relativePan({
    x: (centerX - groupCenterX) * scale,
    y: (centerY - groupCenterY) * scale
  });
  
  group.destroy();
  updateZoomLevel();
}

function updateZoomLevel() {
  document.getElementById('zoomLevel').textContent = Math.round(zoomLevel * 100) + '%';
}

// Alignment Functions
function alignLeft() {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set('left', obj.getBoundingRect().width / 2);
    canvas.renderAll();
  }
}

function alignCenter() {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set('left', canvas.width / 2);
    canvas.renderAll();
  }
}

function alignRight() {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set('left', canvas.width - obj.getBoundingRect().width / 2);
    canvas.renderAll();
  }
}

function alignTop() {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set('top', obj.getBoundingRect().height / 2);
    canvas.renderAll();
  }
}

function alignMiddle() {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set('top', canvas.height / 2);
    canvas.renderAll();
  }
}

function alignBottom() {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set('top', canvas.height - obj.getBoundingRect().height / 2);
    canvas.renderAll();
  }
}

// Object Manipulation
function duplicateObject() {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.clone(function(cloned) {
      cloned.set({
        left: cloned.left + 20,
        top: cloned.top + 20,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
    });
  }
}

function deleteObject() {
  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length > 0) {
    activeObjects.forEach(obj => {
      canvas.remove(obj);
    });
    canvas.discardActiveObject();
  }
}

function selectAll() {
  const selection = new fabric.ActiveSelection(canvas.getObjects(), {
    canvas: canvas,
  });
  canvas.setActiveObject(selection);
  canvas.renderAll();
}

function bringToFront() {
  const obj = canvas.getActiveObject();
  if (obj) {
    canvas.bringToFront(obj);
    canvas.renderAll();
  }
}

function sendToBack() {
  const obj = canvas.getActiveObject();
  if (obj) {
    canvas.sendToBack(obj);
    canvas.renderAll();
  }
}

function bringForward() {
  const obj = canvas.getActiveObject();
  if (obj) {
    canvas.bringForward(obj);
    canvas.renderAll();
  }
}

function sendBackward() {
  const obj = canvas.getActiveObject();
  if (obj) {
    canvas.sendBackward(obj);
    canvas.renderAll();
  }
}

// Copy/Paste functionality
function copyObject() {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.clone(function(cloned) {
      clipboard = cloned;
      showNotification('Object copied to clipboard');
    });
  }
}

function pasteObject() {
  if (clipboard) {
    clipboard.clone(function(cloned) {
      cloned.set({
        left: cloned.left + 20,
        top: cloned.top + 20,
        evented: true,
      });
      if (cloned.type === 'activeSelection') {
        cloned.canvas = canvas;
        cloned.forEachObject(function(obj) {
          canvas.add(obj);
        });
        cloned.setCoords();
      } else {
        canvas.add(cloned);
      }
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  }
}

// Undo/Redo functionality
function saveState() {
  const state = JSON.stringify(canvas.toJSON());
  undoStack.push(state);
  if (undoStack.length > 50) {
    undoStack.shift();
  }
  redoStack = [];
}

function undo() {
  if (undoStack.length > 1) {
    const currentState = undoStack.pop();
    redoStack.push(currentState);
    const previousState = undoStack[undoStack.length - 1];
    canvas.loadFromJSON(previousState, function() {
      canvas.renderAll();
    });
  }
}

function redo() {
  if (redoStack.length > 0) {
    const nextState = redoStack.pop();
    undoStack.push(nextState);
    canvas.loadFromJSON(nextState, function() {
      canvas.renderAll();
    });
  }
}

// Layers Management
function updateLayers() {
  const layersList = document.getElementById('layersList');
  if (!layersList) return;
  
  layersList.innerHTML = '';
  
  const objects = canvas.getObjects().reverse();
  objects.forEach((obj, index) => {
    const layerItem = document.createElement('div');
    layerItem.className = 'layer-item';
    if (canvas.getActiveObjects().includes(obj)) {
      layerItem.classList.add('active');
    }
    
    const icon = getObjectIcon(obj);
    const name = getObjectName(obj, objects.length - index);
    
    layerItem.innerHTML = `
      <div class="layer-visibility" onclick="toggleLayerVisibility(${canvas.getObjects().indexOf(obj)})">
        <i class="fas ${obj.visible !== false ? 'fa-eye' : 'fa-eye-slash'}"></i>
      </div>
      <i class="${icon}"></i>
      <span class="layer-name" ondblclick="editLayerName(this)">${name}</span>
      <div class="layer-actions">
        <button onclick="duplicateLayer(${canvas.getObjects().indexOf(obj)})" title="Duplicate">
          <i class="fas fa-copy"></i>
        </button>
        <button onclick="deleteLayer(${canvas.getObjects().indexOf(obj)})" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    layerItem.onclick = (e) => {
      if (!e.target.closest('.layer-visibility') && !e.target.closest('.layer-actions')) {
        canvas.setActiveObject(obj);
        canvas.renderAll();
        updateLayers();
      }
    };
    
    layersList.appendChild(layerItem);
  });
}

function getObjectIcon(obj) {
  switch(obj.type) {
    case 'i-text':
    case 'text': return 'fas fa-font';
    case 'rect': return 'fas fa-square';
    case 'circle': return 'fas fa-circle';
    case 'triangle': return 'fas fa-play';
    case 'line': return 'fas fa-minus';
    case 'path': return 'fas fa-draw-polygon';
    case 'polygon': return 'fas fa-star';
    case 'image': return 'fas fa-image';
    case 'group': return 'fas fa-object-group';
    default: return 'fas fa-shapes';
  }
}

function getObjectName(obj, index) {
  if (obj.name) return obj.name;
  
  switch(obj.type) {
    case 'i-text':
    case 'text': return obj.text.length > 15 ? obj.text.substring(0, 15) + '...' : obj.text;
    case 'rect': return `Rectangle ${index}`;
    case 'circle': return `Circle ${index}`;
    case 'triangle': return `Triangle ${index}`;
    case 'line': return `Line ${index}`;
    case 'path': return `Path ${index}`;
    case 'polygon': return `Polygon ${index}`;
    case 'image': return `Image ${index}`;
    case 'group': return `Group ${index}`;
    default: return `Object ${index}`;
  }
}

function toggleLayerVisibility(index) {
  const obj = canvas.getObjects()[index];
  if (obj) {
    obj.visible = !obj.visible;
    canvas.renderAll();
    updateLayers();
  }
}

function duplicateLayer(index) {
  const obj = canvas.getObjects()[index];
  if (obj) {
    obj.clone(function(cloned) {
      cloned.set({
        left: cloned.left + 20,
        top: cloned.top + 20,
      });
      canvas.add(cloned);
      updateLayers();
    });
  }
}

function deleteLayer(index) {
  const obj = canvas.getObjects()[index];
  if (obj) {
    canvas.remove(obj);
    updateLayers();
  }
}

function editLayerName(element) {
  const currentName = element.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentName;
  input.className = 'layer-name-input';
  
  input.onblur = input.onkeydown = function(e) {
    if (e.type === 'blur' || e.key === 'Enter') {
      const newName = input.value.trim() || currentName;
      element.textContent = newName;
      element.style.display = 'inline';
      input.remove();
      
      // Update object name
      const layerIndex = Array.from(element.closest('.layer-item').parentNode.children).indexOf(element.closest('.layer-item'));
      const obj = canvas.getObjects().reverse()[layerIndex];
      if (obj) {
        obj.name = newName;
      }
    }
  };
  
  element.style.display = 'none';
  element.parentNode.insertBefore(input, element);
  input.focus();
  input.select();
}

function toggleLayers() {
  const panel = document.getElementById('layersPanel');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  if (panel.style.display === 'block') {
    updateLayers();
  }
}

// Context Menu
function showContextMenu(e) {
  const menu = document.getElementById('contextMenu');
  menu.style.display = 'block';
  menu.style.left = e.clientX + 'px';
  menu.style.top = e.clientY + 'px';
}

function hideContextMenu() {
  document.getElementById('contextMenu').style.display = 'none';
}

// Sidebar Toggle
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const sidebarContent = document.getElementById('sidebarContent');
  const sidebarTitle = document.getElementById('sidebarTitle');
  const toggleIcon = document.getElementById('toggleIcon');
  
  sidebarCollapsed = !sidebarCollapsed;
  
  if (sidebarCollapsed) {
    sidebar.classList.add('collapsed');
    sidebarContent.style.display = 'none';
    sidebarTitle.style.display = 'none';
    toggleIcon.className = 'fas fa-chevron-right';
  } else {
    sidebar.classList.remove('collapsed');
    sidebarContent.style.display = 'block';
    sidebarTitle.style.display = 'block';
    toggleIcon.className = 'fas fa-chevron-left';
  }
}

// Shape Options Toggle
function showShapeOptions() {
  const options = document.getElementById('shapeOptions');
  options.style.display = options.style.display === 'none' ? 'grid' : 'none';
}

// Template Functions
function loadTemplate(templateType) {
  if (confirm('Load template? This will clear the current canvas.')) {
    canvas.clear();
    
    switch(templateType) {
      case 'business-card':
        setCanvasSize(350, 200, 'Business Card');
        
        const businessBg = new fabric.Rect({
          left: 0,
          top: 0,
          width: 350,
          height: 200,
          fill: '#f8f9fa',
          selectable: false
        });
        
        const businessText = new fabric.IText('John Doe', {
          left: 30,
          top: 30,
          fontSize: 24,
          fill: '#333333',
          fontWeight: 'bold',
          fontFamily: 'Arial'
        });
        
        const titleText = new fabric.IText('Senior Designer', {
          left: 30,
          top: 60,
          fontSize: 16,
          fill: '#666666',
          fontFamily: 'Arial'
        });
        
        const contactText = new fabric.IText('john@example.com\n+1 (555) 123-4567', {
          left: 30,
          top: 120,
          fontSize: 12,
          fill: '#888888',
          fontFamily: 'Arial'
        });
        
        const accent = new fabric.Rect({
          left: 0,
          top: 0,
          width: 5,
          height: 200,
          fill: '#667eea',
          selectable: false
        });
        
        canvas.add(businessBg, accent, businessText, titleText, contactText);
        break;
        
      case 'poster':
        setCanvasSize(600, 800, 'Event Poster');
        
        const posterBg = new fabric.Gradient({
          type: 'linear',
          coords: { x1: 0, y1: 0, x2: 0, y2: 800 },
          colorStops: [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ]
        });
        canvas.setBackgroundColor(posterBg, canvas.renderAll.bind(canvas));
        
        const posterTitle = new fabric.IText('EVENT POSTER', {
          left: 300,
          top: 150,
          fontSize: 48,
          fill: '#ffffff',
          fontWeight: 'bold',
          textAlign: 'center',
          originX: 'center',
          fontFamily: 'Impact'
        });
        
        const posterSubtitle = new fabric.IText('Join us for an amazing experience', {
          left: 300,
          top: 220,
          fontSize: 20,
          fill: '#ffffff',
          textAlign: 'center',
          originX: 'center',
          fontFamily: 'Arial'
        });
        
        const posterDate = new fabric.IText('December 25, 2024', {
          left: 300,
          top: 600,
          fontSize: 24,
          fill: '#ffffff',
          textAlign: 'center',
          originX: 'center',
          fontFamily: 'Arial'
        });
        
        canvas.add(posterTitle, posterSubtitle, posterDate);
        break;
        
      case 'instagram-post':
        setCanvasSize(1080, 1080, 'Instagram Post');
        
        const instaBg = new fabric.Gradient({
          type: 'radial',
          coords: { x1: 540, y1: 540, r1: 0, x2: 540, y2: 540, r2: 540 },
          colorStops: [
            { offset: 0, color: '#ff6b6b' },
            { offset: 1, color: '#4ecdc4' }
          ]
        });
        canvas.setBackgroundColor(instaBg, canvas.renderAll.bind(canvas));
        
        const instaTitle = new fabric.IText('Follow Us!', {
          left: 540,
          top: 400,
          fontSize: 72,
          fill: '#ffffff',
          fontWeight: 'bold',
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          fontFamily: 'Arial'
        });
        
        const instaHandle = new fabric.IText('@designstudio', {
          left: 540,
          top: 500,
          fontSize: 36,
          fill: '#ffffff',
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          fontFamily: 'Arial'
        });
        
        canvas.add(instaTitle, instaHandle);
        break;
        
      case 'presentation':
        setCanvasSize(1920, 1080, 'Presentation Slide');
        
        canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
        
        const slideTitle = new fabric.IText('Presentation Title', {
          left: 960,
          top: 200,
          fontSize: 72,
          fill: '#333333',
          fontWeight: 'bold',
          textAlign: 'center',
          originX: 'center',
          fontFamily: 'Arial'
        });
        
        const slideSubtitle = new fabric.IText('Your subtitle here', {
          left: 960,
          top: 300,
          fontSize: 36,
          fill: '#666666',
          textAlign: 'center',
          originX: 'center',
          fontFamily: 'Arial'
        });
        
        const headerLine = new fabric.Rect({
          left: 0,
          top: 0,
          width: 1920,
          height: 10,
          fill: '#667eea',
          selectable: false
        });
        
        canvas.add(headerLine, slideTitle, slideSubtitle);
        break;
    }
    
    saveState();
  }
}

// Project Management
function newProject() {
  if (confirm('Create a new project? This will clear the current canvas.')) {
    canvas.clear();
    setCanvasSize(800, 600, 'Default');
    canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
    undoStack = [];
    redoStack = [];
    saveState();
  }
}

function saveProject() {
  const projectData = {
    canvas: canvas.toJSON(['name']),
    canvasSize: currentCanvasSize,
    timestamp: new Date().toISOString(),
    version: '2.0'
  };
  
  const dataStr = JSON.stringify(projectData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `design-project-${Date.now()}.json`;
  link.click();
  
  showNotification('Project saved successfully!');
}

function openProject() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        try {
          const projectData = JSON.parse(event.target.result);
          
          if (projectData.canvasSize) {
            setCanvasSize(projectData.canvasSize.width, projectData.canvasSize.height, projectData.canvasSize.name);
          }
          
          canvas.loadFromJSON(projectData.canvas, function() {
            canvas.renderAll();
            updateLayers();
            saveState();
            showNotification('Project loaded successfully!');
          });
        } catch (error) {
          showNotification('Error loading project: ' + error.message, 'error');
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}

function exportProject() {
  const exportMenu = document.createElement('div');
  exportMenu.className = 'modal-overlay';
  exportMenu.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Export Options</h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="export-options">
          <div class="export-format">
            <h4>Image Formats</h4>
            <button class="btn export-btn" onclick="exportAs('png')">
              <i class="fas fa-file-image"></i>
              PNG (Transparent Background)
            </button>
            <button class="btn export-btn" onclick="exportAs('jpg')">
              <i class="fas fa-file-image"></i>
              JPG (Compressed)
            </button>
            <button class="btn export-btn" onclick="exportAs('svg')">
              <i class="fas fa-file-code"></i>
              SVG (Vector)
            </button>
          </div>
          <div class="export-settings">
            <h4>Export Settings</h4>
            <div class="setting-group">
              <label>Quality (JPG only)</label>
              <input type="range" id="exportQuality" min="0.1" max="1" step="0.1" value="0.9">
              <span id="qualityValue">90%</span>
            </div>
            <div class="setting-group">
              <label>Scale Multiplier</label>
              <input type="range" id="exportScale" min="0.5" max="4" step="0.5" value="2">
              <span id="scaleValue">2x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(exportMenu);
  
  // Update value displays
  document.getElementById('exportQuality').oninput = function() {
    document.getElementById('qualityValue').textContent = Math.round(this.value * 100) + '%';
  };
  
  document.getElementById('exportScale').oninput = function() {
    document.getElementById('scaleValue').textContent = this.value + 'x';
  };
}

function exportAs(format) {
  const quality = parseFloat(document.getElementById('exportQuality').value);
  const scale = parseFloat(document.getElementById('exportScale').value);
  
  let dataURL;
  let filename = `design-${Date.now()}.${format}`;
  
  switch(format) {
    case 'png':
      dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: scale
      });
      break;
    case 'jpg':
      dataURL = canvas.toDataURL({
        format: 'jpeg',
        quality: quality,
        multiplier: scale
      });
      break;
    case 'svg':
      dataURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(canvas.toSVG());
      filename = `design-${Date.now()}.svg`;
      break;
  }
  
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;
  link.click();
  
  // Close export menu
  document.querySelector('.modal-overlay').remove();
  showNotification(`Design exported as ${format.toUpperCase()}!`);
}

// Utility Functions
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Filter Functions
function applyFilter(filterType) {
  const obj = canvas.getActiveObject();
  if (!obj || obj.type !== 'image') {
    showNotification('Please select an image to apply filters', 'error');
    return;
  }
  
  switch(filterType) {
    case 'grayscale':
      obj.filters.push(new fabric.Image.filters.Grayscale());
      break;
    case 'sepia':
      obj.filters.push(new fabric.Image.filters.Sepia());
      break;
    case 'blur':
      obj.filters.push(new fabric.Image.filters.Blur({ blur: 0.1 }));
      break;
    case 'brightness':
      obj.filters.push(new fabric.Image.filters.Brightness({ brightness: 0.2 }));
      break;
    case 'contrast':
      obj.filters.push(new fabric.Image.filters.Contrast({ contrast: 0.2 }));
      break;
    case 'vintage':
      obj.filters.push(new fabric.Image.filters.Sepia());
      obj.filters.push(new fabric.Image.filters.Contrast({ contrast: -0.1 }));
      break;
    case 'clear':
      obj.filters = [];
      break;
  }
  
  obj.applyFilters();
  canvas.renderAll();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  updateLayers();
  saveState();
  updateCanvasInfo();
  
  // Add mouse wheel zoom
  canvas.on('mouse:wheel', function(opt) {
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.setZoom(zoom);
    zoomLevel = zoom;
    updateZoomLevel();
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });

  // Drag and drop support
  canvas.on('drop', function(e) {
    if (e.e.dataTransfer && e.e.dataTransfer.files.length > 0) {
      const files = Array.from(e.e.dataTransfer.files);
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = function(event) {
            fabric.Image.fromURL(event.target.result, function(img) {
              const maxWidth = canvas.width * 0.5;
              const maxHeight = canvas.height * 0.5;
              const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
              
              img.scale(scale);
              img.set({
                left: e.e.offsetX / canvas.getZoom(),
                top: e.e.offsetY / canvas.getZoom(),
                originX: 'center',
                originY: 'center'
              });
              
              canvas.add(img);
              canvas.setActiveObject(img);
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });

  canvas.on('dragover', function(e) {
    e.e.preventDefault();
  });

  // Auto-save functionality
  setInterval(() => {
    try {
      const autoSaveData = canvas.toJSON(['name']);
      localStorage.setItem('autosave-design', JSON.stringify({
        canvas: autoSaveData,
        canvasSize: currentCanvasSize,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.log('Auto-save failed:', e);
    }
  }, 30000); // Auto-save every 30 seconds

  // Load auto-save on startup
  try {
    const autoSaveData = localStorage.getItem('autosave-design');
    if (autoSaveData) {
      const data = JSON.parse(autoSaveData);
      const autoSaveTime = new Date(data.timestamp);
      const now = new Date();
      const timeDiff = (now - autoSaveTime) / (1000 * 60); // minutes
      
      if (timeDiff < 60) { // Auto-save is less than 1 hour old
        if (confirm('An auto-saved design was found. Would you like to restore it?')) {
          if (data.canvasSize) {
            setCanvasSize(data.canvasSize.width, data.canvasSize.height, data.canvasSize.name);
          }
          canvas.loadFromJSON(data.canvas, function() {
            canvas.renderAll();
            updateLayers();
            saveState();
          });
        }
      }
    }
  } catch (e) {
    console.log('Auto-save restore failed:', e);
  }

  console.log('Professional Design Studio Pro loaded successfully!');
});