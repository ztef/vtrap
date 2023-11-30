function runCode() {
    const htmlCode = document.getElementById('html-editor').value;
    const jsCode = document.getElementById('js-editor').value;
    const resultFrame = document.getElementById('result-frame');
  
    // Combine HTML and JavaScript code
    const fullCode = `<html>
      <head>
      <meta charset="utf-8">
      <script src="head-content.js" defer></script>
      <script src="../viOne/js/jquery/jquery.min.js"></script>    
      <script type="text/javascript" src="javascripts/libs/jquery-3.1.1.min.js"></script>
      <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
      <link rel="stylesheet" href="../styles/jquery/ui/1.12.1/themes/base/jquery-ui.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      <link rel="stylesheet" href="styles.css"> 

      </head>
      <body>
        <script type="importmap">
            {
            "imports": {
            "three": "/front/app/build/three.module.js",
            "three/addons/": "/front/app/build/jsm/"
            }
            }
        </script>

        
            ${htmlCode}
            <script type="module">
            ${jsCode}
        </script>
      </body>
    </html>`;
  
    const combinedCode = `<html><head><style>${getEditorStyle()}</style></head><body>${htmlCode}<script type="module">${jsCode}</script></body></html>`;

    // Inject the combined code into the result container
    //document.getElementById('result-container').innerHTML = combinedCode;
 
    const tempDiv = document.createElement('div');

  // Set the content of the temporary div
  tempDiv.innerHTML = combinedCode;

  // Append the temporary div to the result container
  const resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = '';
  resultContainer.appendChild(tempDiv);

  // Move scripts from the temporary div to the result container
  moveScripts(tempDiv, resultContainer);
 
 
 
 
  }

  function moveScripts(from, to) {
    const scripts = from.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const script = document.createElement('script');
      
      // Set the type attribute to "module" if it's a module script
      if (scripts[i].type === 'module') {
        script.type = 'module';
      }
  
      script.text = scripts[i].text;
      to.appendChild(script);
    }
  }
  
  

  function getEditorStyle() {
    // You can customize the editor style if needed
    return `
      body {
        font-family: 'Arial', sans-serif;
        padding: 10px;
      }
    `;
  }