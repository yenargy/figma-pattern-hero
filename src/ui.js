import './ui.css'
import $ from "jquery";

document.getElementById('create').onclick = () => {
  const rows = Number($('#rows').val());
  const cols = Number($('#cols').val());
  const padding = Number($('#padding').val());
  const shuffle = $('#shuffle').prop("checked");
  const repeat = $('#repeat').prop("checked");
  parent.postMessage({ pluginMessage: { type: 'create-grid', options: {rows, cols, padding, shuffle, repeat } } }, '*')
}

document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}