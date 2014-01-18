'use strict';


requirejs.config({
    baseUrl: "/components",
    paths: {
      text: "requirejs-text/text",
      bootstrap: "bootstrap/dist/js/bootstrap.min",
      jquery: "jquery/jquery.min",
      'dust-helpers': "dustjs-helpers-amd/dust-helpers",
      dust: "dustjs-linkedin-amd/dust-full-1.2.2",
      EventEmitter: "EventEmitter/EventEmitter",
      'jquery.ui.widget': "jquery-file-upload/js/vendor/jquery.ui.widget",
      upload: "jquery-file-upload/js/jquery.fileupload"
    }
});
