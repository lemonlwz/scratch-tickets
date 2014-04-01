(function(plugin){
  if(typeof define === "function" && define.cmd){
    define(function(require, exports, module){
      module.exports = plugin();
    });
  } else {
    window.scratchTickets = plugin();
  }
})(function(){

  var _timer;

  var method = {
    init: function($elem, opt){
      var $canvas, ctx;

      $canvas = method.createCanvas($elem, opt);
      ctx = method.ctx($canvas, opt);
      method.bind($canvas, ctx, opt);
    },
    bind: function($canvas, ctx, opt){
      var mousedown = false;

      if('createTouch' in document){
        $canvas.addEventListener('touchstart', eventDown);
        $canvas.addEventListener('touchend', eventUp);
        $canvas.addEventListener('touchmove', eventScratch);
      } else {
        $canvas.addEventListener('mousedown', eventDown);
        $canvas.addEventListener('mouseup', eventUp);
        $canvas.addEventListener('mousemove', eventScratch);
      }

      function eventDown(evt){
        mousedown = true;
        evt.preventDefault();
      };

      function eventUp(evt){
        mousedown = false;
        evt.preventDefault();
      };

      function eventScratch(evt){

        if(!mousedown){
          return;
        }

        var x, y, touches;
        touches = evt.touches;

        if(!touches){
          x = (evt.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft) || evt.pageX) - (opt.offsetX || 0);
          y = (evt.clientY + (document.body.scrollTop || document.documentElement.scrollTop) || evt.pageY) - (opt.offsetY || 0);

          method.scratch(x, y, ctx, opt, complete);
        } else {
          for(var i = 0, l = touches.length; i < l; i++){
            x = (touches[i].clientX + (document.body.scrollLeft || document.documentElement.scrollLeft) || touches[i].pageX) - (opt.offsetX || 0);
            y = (touches[i].clientY + (document.body.scrollTop || document.documentElement.scrollTop) || touches[i].pageY) - (opt.offsetY || 0);
            method.scratch(x, y, ctx, opt, complete);
          }
        }

        evt.preventDefault();
      };

      function complete(){
        opt.callback&&opt.callback();
        complete = null;
      };
    },
    createCanvas: function($elem, opt){
      var $canvas = document.createElement('canvas');
      var $_canvas;

      $elem.style.position = 'relative';
      $elem.style.width = opt.width + 'px';
      $elem.style.height = opt.height + 'px';

      $canvas.style.position = 'absolute';
      $canvas.style.left = 0;
      $canvas.style.top = 0;

      $canvas.width = opt.width;
      $canvas.height = opt.height;

      $_canvas = method.backgroundText($elem, opt);
      method.backgroundImage($canvas, opt, $_canvas);

      $elem.appendChild($canvas);

      opt.offsetX = $elem.offsetLeft;
      opt.offsetY = $elem.offsetTop;

      return $canvas;
    },
    ctx: function($canvas, opt){
      ctx = $canvas.getContext('2d');

      method.layer(ctx, opt);

      ctx.globalCompositeOperation = 'destination-out';

      return ctx;
    },
    backgroundImage: function($canvas, opt, $_canvas){
      if(!opt.url){
        return;
      }

      if($_canvas){
        $_canvas.style.backgroundImage = 'url(' + opt.url + ')';
      } else {
        $canvas.style.backgroundImage = 'url(' + opt.url + ')';
      }

    },
    backgroundText: function($elem, opt, ctx){
      if(!opt.text){
        return;
      }

      var $canvas, ctx, x, y, _txtOpt;

      $canvas = document.createElement('canvas');
      $canvas.style.position = 'absolute';
      $canvas.style.left = 0;
      $canvas.style.top = 0;
      $canvas.width = opt.width;
      $canvas.height = opt.height;

      ctx = $canvas.getContext('2d');

      x = opt.width / 2;
      y = opt.height / 2;

      opt.text = opt.text || {};
      _txtOpt = opt.text;

      _txtOpt.size = opt.text.size || '30';
      _txtOpt.align = opt.text.align || 'center';
      _txtOpt.baseline = opt.text.baseline || 'middle';
      _txtOpt.color = opt.text.color || '#000';
      _txtOpt.content = opt.text.content || 'Hello World';

      ctx.font = _txtOpt.size + "px 'Microsoft Yahei' Simsun sans-serif";
      ctx.textAlign = _txtOpt.align;
      ctx.textBaseline = _txtOpt.baseline;
      ctx.fillStyle = _txtOpt.color;
      ctx.fillText(_txtOpt.content, x, y);

      $elem.appendChild($canvas);

      return $canvas;
    },
    layer: function(ctx, opt){
      var $layerImg = document.createElement('img');
      $layerImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjgwQzFBMjNCOTUwMTFFM0E0OEVEMTk5M0VGMUVFOUUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjgwQzFBMjRCOTUwMTFFM0E0OEVEMTk5M0VGMUVFOUUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCODBDMUEyMUI5NTAxMUUzQTQ4RUQxOTkzRUYxRUU5RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCODBDMUEyMkI5NTAxMUUzQTQ4RUQxOTkzRUYxRUU5RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhpbhwEAAAOzSURBVHjaTNaJThtBEEVRPB4Wswgh8ef8JyD2gB1yZw5p0VJIT3etr15Ve3N3d3d0dLTb7R4eHvb7ffubm5vPz895nqdp+vr6+rOus7Ozq6ur/bq+v78TODk52W63XfWZ+t91dZIFMtPnuvpIOXMJvb+/H62r8ySSvry8PD09zc3Ly8vz83MnPtNqs9lsEuvvtK4UD4dDf2fK6SR0cXHRXcrJpfbx8ZFE+7wmVlDJ5LsIUk6L0Q7F3qa/MFhMl1f+UxsxpmmThHC6Tabzk3X1melxvltXG566As7UP1AWb/vj42Mgtn97e+M1iErC4evra4cJj7QWKysOnbRXpGwu/11fX0Mqu/kU/nCQQliDSA3YGsjkQHJ9klHViYkkBLhZl4Lwn1wuUxBvh31KuX12R6TJdJV6wS3qfaNXDs/Pz0Mm0VFxObIozPaZ4ztDCrBQbQWhq4wo/qSAfXTH4ij9yDFzCYz8GE0gXqkqIqIdPKvTDLhMwBHbM4peoMCipAs8hpEpwMp7e3sLcVxoZTqbS6xSTnTUnYNEEaY9nnVrk1Fo1gfUCyL3cBdilZ856ULgCY0C5qzSJQCZZBAUdGWQsGbuFobYgsFzKaTfEW7gTT6qRjqhiSHwQfYwsR/yBZHFTOFo+2wu0W3XpWL5aK9BOikvhdKBOWsMdAhTALbJtyzxz+RYetro0CamAeCyVezaFVs7aS6mSUb7QEaFDACEmfqA0f39fUfaAdxtjDpYpYwDEM/T4+Mj+jPSZtRjSbqIcKPYBxOUonCyO4isD1GibIywbJlHGYGMuVY9ZnXQKckFv1oDLhORt32iOoL7rCQP8U6Mb7l6Lpbx1JHmNkPEZc+cNMGqA0IvE6IDsa7RTbp8qR9wx8zstEi78Hx8/V9pCkfgSodO2QK6FsHjJQPI4l/7AMGZlA/rYkjKlLkxT7BtNLdXUKyzlHFW9ZFM7r+b23TMYmlp19pHjxh+HSYj++UBG+9QywtrNnlBRsfDxKjCGfPSa8d6n5HVU7AwxGtmyIVGe+N88GS0q9oqIP6MBxcXvEc8df4z0RmCb6e4ZWYBF9NZUbpBmG5TBKMBB9glai98a3SBqP2Okbvpkyd7VDOjOfvdNSRnFfv9snjlLGpJKyPOGr+KTOV4XeO1UoxJNZUOAoaZRoAGKDyJnjGdhX9wALExIOkZaYCo3XnSZqZlyqoHhKenpz79pJJrxPgh3CpmDv/Ma7AMcFVpjA6PmfYxNPTB+GXhpa+YQ7fJ80+AAQDgpv0UX/dfUAAAAABJRU5ErkJggg==';
      var imgFill = ctx.createPattern($layerImg, 'repeat');

      ctx.beginPath();
      ctx.fillStyle = imgFill;
      ctx.fillRect(0, 0, opt.width, opt.height);
      ctx.closePath();
    },
    scratch: function(x, y, ctx, opt, complete){
      var scratchSize = opt.scratchSize || 16;
      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.arc(x, y, scratchSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      clearTimeout(_timer);
      _timer = setTimeout(function(){
        method.check(ctx, opt, complete);
      }, 200);
    },
    check: function(ctx, opt, complete){
      var width, height, x, y;
      var area = opt.area;
      var ratio = opt.ratio || 0.3;

      if(area){
        width = area.width || opt.width;
        height = area.height || opt.height;
        x = area.x || 0;
        y = area.y || 0;
      } else {
        width = opt.width;
        height = opt.height;
        x = 0;
        y = 0;
      }

      var data=ctx.getImageData(x, y, width, height).data;

      for(var i=0,j=0;i< data.length;i+=4){
        if(data[i] && data[i+1] && data[i+2] && data[i+3]){
          j++;
        }
      }

      if(j<=width*height*ratio){
        complete&&complete();
      }
    }
  };

  return function($elem, opt){
    method.init($elem, opt);
  }
});
