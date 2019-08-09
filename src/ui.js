import './ui.css'
import $ from "jquery";

document.getElementById('create').onclick = () => {
  const rows = Number($('#rows').val());
  const cols = Number($('#cols').val());
  const padding = Number($('#padding').val());
  parent.postMessage({ pluginMessage: { type: 'create-grid', dimensions: {rows, cols, padding } } }, '*')
}

document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}