import './ui.css'
import Vue from "vue";

let app = new Vue({
  el: '#app',
  data: {
    config: {
      rows: 10,
      cols: 10,
      padding: 5,
      shuffle: false,
      repeat: true,
      group: true,
      offsetOddRows: false,
    },
    loading: false,
  },
  mounted() {
    // Initing plugin for saved settings
    parent.postMessage({ pluginMessage: { type: 'INIT_PLUGIN' } }, '*')
  },
  methods: {
    createPattern: function() {
      if (this.loading) return;

      this.loading = true;

      //Adding timeout to show the loader in button
      setTimeout(() => {
        parent.postMessage({ pluginMessage: { type: 'CREATE_GRID', options: this.config } }, '*');
      },100);
    }
  }
})

// Function to recieve events from figma
onmessage = e => {
  if (!e.data) return;

  const data = e.data.pluginMessage.data;
  const type = e.data.pluginMessage.type;

  if (type === 'SETTINGS') {
    if (data) {
      Object.assign(app.config, data);
    }
  }
  if (type === 'DONE_LOADING') {
    app.loading = false;
  }
  if (type === 'ERROR_EMPTY_SELECTION') {
    app.loading = false;
  }
};