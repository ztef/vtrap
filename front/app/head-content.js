// head-content.js

// Function to dynamically add links and scripts to the head element
function addHeadContent() {
    // Link elements
    addLink('https://fonts.googleapis.com/css?family=Cabin', 'stylesheet', 'type="text/css"');
    addLink('https://fonts.googleapis.com/css?family=Coda:400,800', 'stylesheet', 'type="text/css"');
    addLink('https://fonts.googleapis.com/css?family=Lora', 'stylesheet');
  
    addLink('stylesheets/all.min.css', 'stylesheet');
    addLink('stylesheets/bootstrap.min.css', 'stylesheet');
    addLink('stylesheets/style.css', 'stylesheet');
  
    // Script elements
    addScript('javascripts/config.js', 'type="text/javascript"');
    //addScript('javascripts/libs/jquery-3.1.1.min.js', 'type="text/javascript"');
    addScript('javascripts/libs/popper.min.js', 'type="text/javascript"');
    addScript('javascripts/libs/bootstrap.min.js', 'type="text/javascript"');
    addScript('javascripts/libs/three.min.js', 'type="text/javascript"');
    addScript('javascripts/libs/OrbitControls.js', 'type="text/javascript"');
    addScript('javascripts/libs/TrackballControls.js', 'type="text/javascript"');
    addScript('javascripts/libs/VOne.min.js', 'type="text/javascript"');
    addScript('javascripts/libs/Tween.js', 'type="text/javascript"');
  
    addScript('javascripts/data.js', 'type="text/javascript"');
    addScript('javascripts/helperFunctions.js', 'type="text/javascript"');
    addScript('javascripts/visualization.js', 'type="text/javascript"');
    addScript('javascripts/init.js', 'type="text/javascript"');
  
    //addScript('../viOne/js/jquery/jquery.min.js', 'type="text/javascript"');
    addScript('../viOne/view/vi_tooltipHelpers.js', 'type="text/javascript"');
  
    //addScript('https://code.jquery.com/ui/1.12.1/jquery-ui.js', 'type="text/javascript"');
  
    // You can also add additional script elements here...
  
    // Link elements
    addLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css', 'stylesheet');
    addLink('styles.css', 'stylesheet');
  }
  
  // Function to add a link element to the head
  function addLink(href, rel, attributes = '') {
    const link = document.createElement('link');
    link.href = href;
    link.rel = rel;
    link.innerHTML = attributes;
    document.head.appendChild(link);
  }
  
  // Function to add a script element to the head
  function addScript(src, attributes = '') {
    const script = document.createElement('script');
    script.src = src;
    script.innerHTML = attributes;
    document.head.appendChild(script);
  }
  
  // Call the function to add links and scripts
  addHeadContent();
  