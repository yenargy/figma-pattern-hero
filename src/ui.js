import './ui.css'
import $ from "jquery";

document.getElementById('create').onclick = () => {
  const rows = $('#rows').val();
  const cols = $('#cols').val();
  parent.postMessage({ pluginMessage: { type: 'create-grid', dimensions: {rows, cols } } }, '*')
}

document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}