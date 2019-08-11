import './ui.css'
import $ from "jquery";

let loading = false;

document.getElementById('create').onclick = () => {
  if (loading) {
    return;
  }
  loading = true;
  toggleLoadingButton();
  const rows = Number($('#rows').val());
  const cols = Number($('#cols').val());
  const padding = Number($('#padding').val());
  const shuffle = $('#shuffle').prop("checked");
  const repeat = $('#repeat').prop("checked");
  //Adding timeout to show the loader in button
  setTimeout(() => {
    parent.postMessage({ pluginMessage: { type: 'CREATE_GRID', options: {rows, cols, padding, shuffle, repeat } } }, '*');
  },500);
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
    }
  }
  if (type === 'DONE_LOADING') {
    loading = false;
    toggleLoadingButton();
  }
  if (type === 'ERROR') {
    loading = false;
    toggleLoadingButton();
    $('#error').fadeIn(200, function() {
      $('#error').delay(2500).fadeOut();
    })
  }
};

const toggleLoadingButton = () => {
  if (loading) {
    $('#default-action').hide();
    $('#loading-action').show();
  } else {
    $('#default-action').show();
    $('#loading-action').hide();
  }
}

const initPlugin = () => {
  parent.postMessage({ pluginMessage: { type: 'INIT_PLUGIN' } }, '*')
}

initPlugin();
