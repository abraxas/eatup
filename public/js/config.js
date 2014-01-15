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
    }
});
