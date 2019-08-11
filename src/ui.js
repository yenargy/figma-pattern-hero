import './ui.css'
import $ from "jquery";

document.getElementById('create').onclick = () => {
  const rows = Number($('#rows').val());
  const cols = Number($('#cols').val());
  const padding = Number($('#padding').val());
  const shuffle = $('#shuffle').prop("checked");
  const repeat = $('#repeat').prop("checked");
  parent.postMessage({ pluginMessage: { type: 'CREATE_GRID', options: {rows, cols, padding, shuffle, repeat } } }, '*')
}

onmessage = e => {
  const data = e.data.pluginMessage.data;
  const type = e.data.pluginMessage.type;
  if (type === 'SETTINGS') {
    if (!data) {
      $('#rows').val(10);
      $('#cols').val(10);
      $('#padding').val(5);
      $('#shuffle').prop("checked", false);
      $('#repeat').prop("checked", true);
    } else {
      $('#shuffle').prop("checked", data.shuffle);
      $('#repeat').prop("checked", data.repeat);
      // $('#rows').val(data.rows);
      // $('#cols').val(data.cols);
      // $('#padding').val(data.padding);
    }
  }

};

const initPlugin = () => {
  parent.postMessage({ pluginMessage: { type: 'INIT_PLUGIN' } }, '*')
}

initPlugin();
