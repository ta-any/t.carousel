# Touch Slider

Easy to use carousel, with infinite loop and lightweight, no dependencies.

# Installation
```
<script type="text/javascript" src='t_carusel.js'></script>
```
# Usage
```
  <div id="baner">
      <div>...</div>
      <div>...</div>
      <div>...</div>
  </div>
```
```
let baner = new Carusel('baner', {
  ...
})
baner.start()
```
add css file with your styles

# Default options
```
new Carusel(block, {
  'touch': true,
  'dots': false,
  'arrows': false,
  'duration': 500,
  'index' : 0,
  'loop' : false,
  'timer': false,
  'duration_timer': 2000,
})
```

