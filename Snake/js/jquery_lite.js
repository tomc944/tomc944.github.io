(function(root) {
  var _onReadyCallbacks = [], _docReady = false;

  document.addEventListener("DOMContentLoaded", function(){
    _docReady = true;
    _onReadyCallbacks.forEach(function(callback) { callback(); });
  });

  var registerDocCallback = function(callback) {
    if(!_docReady) {
      _onReadyCallbacks.push(callback)
    } else {
      callback();
    }
  };

  var DOMNodeCollection = function(nodes) {
    this.nodes = Array.prototype.slice.call(nodes);
  };

  DOMNodeCollection.prototype = {
    each: function(cb) {
      this.nodes.forEach(cb);
    },
    html: function(html) {
      if (this.nodes.length === 0) { return; }

      if (arguments.length === 0){
        return this.nodes[0].innerHTML;
      } else {
        this.nodes.forEach(function (node) {
          node.innerHTML = string;
        });
      }
    },

    empty: function () {
      this.html("");
    },


    append: function(obj) {
      if (obj instanceof DOMNodeCollection) {
        for (var i = 0; i < this.nodes.length; i++){
          for (var j =0; j < obj.nodes.length; j++){
            this.nodes[i].appendChild(obj.nodes[j]);
          }
        }
      } else if (typeof obj === "string") {
        this.nodes.forEach(function (node) {
          node.innerHTML += obj;
        });
      } else {
        this.nodes.forEach(function (node) {
          node.appendChild(obj);
        });
      }
    },


    attr: function(key, value) {
      if(typeof val === 'string') {
        this.each(function(node) {
          node.setAttribute(key, val);
        });
      } else {
        return this.nodes[0].getAttribute(key);
      }
    },


  // Potentially you can use Element.classList

    addClass: function (newClass) {
      this.each(function(node) {
        node.classList.add(newClass);
      });
    },


    removeClass: function (oldClass) {
      this.each(function(node) {
        node.classList.remove(oldClass);
      });
    },


    children: function () {
      var childNodes = [];
      this.each(function(node) {
        var childrenArr = [].slice.apply(node.children);
        childNodes = childNodes.concat(childrenArr);
      });
      return new DOMNodeCollection(childNodes);
    },


    parent: function () {
      var parentNodes = [];
      this.each(function(node) {
        parentNode.push(node.parentNode)
      });
      return new DOMNodeCollection(parentNodes);
    },


    find: function(selector) {
      var foundNodes = [];
      this.each(function(node) {
        var nodeList = [].slice.apply(node.querySelectorAll(selector));
        foundNodes = foundNodes.concat(nodeList);
      });
      return new DOMNodeCollection(foundNodes);
    },


    remove: function() {
      this.each(function(node) {
        node.parentNode.removeChild(node);
      });
    },


    on: function (e, callback) {
      this.each(function(node) {
        node.addEventListener(e, callback)
      })
    },


    off: function (e, selector, handler) {
      this.each(function(node) {
        node.removeEventListener(e, callback)
      })
    }
  };

  root.$l = function(argument) {
    var returnValue;
    switch(typeof(argument)) {
      case "function":
        registerDocCallback(argument);
        break;
      case "string":
        var nodes = [].slice.call(document.querySelectorAll(argument), 0);
        returnValue = new DOMNodeCollection(nodes);
      case 'object':
        if (argument instanceof HTMLElement) {
          returnValue = new DOMNodeCollection([argument]);
        }
        break;
    }
    return returnValue;
  };

  root.$l.extend = function (target) {
    var otherObjs = Array.prototype.slice.call(arguments, 1);
    otherObjs.forEach(function(obj) {
      for(var prop in obj){
        if (obj.hasOwnProperty(prop)) {
          target[prop] = obj[prop]
        }
      }
    })
    return target;
  };

  var toQueryString = function(obj) {
    var result = '';
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        result += prop + "=" + obj[prop] + '&';
      }
    }
    // we subtract off the end of the string to get rid of the last amperstand
    return result.substring(0, result.length - 1);
  }

  root.$l.ajax = function (options) {
    var myRequest = new XMLHttpRequest();
    var defaults = {
      contentType: 'application/x-www-form-urlencode; charset=UTF-8',
      method: 'GET',
      url: "",
      success: function(){},
      error: function(){},
      data: {}
    };

    options = root.$l.extend(defaults, options);

    if (options.method.toUpperCase() === "GET") {
      options.url += "?" + toQueryString(options.data);
    }

    myRequest.open(options.method, options.url, true);
    myRequest.onload = function(e) {
      if (myRequest.status === 200) {
        options.success(myRequest.response);
      } else {
        options.error(myRequest.response);
      }
    };

    myRequest.send(JSON.stringify(options.data))
  };
})(this);
