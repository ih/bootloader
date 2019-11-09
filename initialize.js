function loadJavaScriptFile(url) {
  return new Promise(resolve => {
    const srcTag = document.createElement('script');
    srcTag.src = url;
    srcTag.async = false;
    srcTag.defer = false;
    srcTag.addEventListener('load', () => {
      console.log('loaded!');
      resolve();
    });
    
    document.head.appendChild(srcTag);
  });
}

function addCss(url) {
  const cssTag = document.createElement('link');
  cssTag.rel = 'stylesheet';
  cssTag.href = url;
  document.head.appendChild(cssTag);
}

function addExecuteButton(editor) {
  const saveButton = document.createElement('button');
  saveButton.innerHTML = 'Run';
  saveButton.addEventListener('click', () => {
    console.log(editor.getValue());
    executor.load(editor.getValue());
  });
  document.body.appendChild(saveButton);
}

function getIdToken() {
  const url = new URL(window.location.href.replace('#', '?'));
  return url.searchParams.get('id_token');
}

async function putTest() {
  console.log('put test');
  // get the token
  const idToken = getIdToken();
  const response = await fetch(
    `https://avpou559j3.execute-api.us-east-1.amazonaws.com/development/programs/testp`,
    {
      method: 'POST',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': idToken 
      },
      body: JSON.stringify({
        code: 'jfdska'
      })
    }
  );
  const jsonResponse = await response.json();
  console.log(jsonResponse);
}

function updateWorldStorage() {
  const idToken = getIdToken();
  worldStorage.putProgram = async function(key, code) {
    const response = await fetch(
      `${this.baseUrl}/programs/${key}`,
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': idToken
        },
        body: JSON.stringify({
          code: code.split('\n')
        })
      }
    )
  }
}

function addProgramNameInput() {
  const programNameInput = document.createElement('input');
  programNameInput.type = 'text';
  programNameInput.id = 'program-name';
  document.body.appendChild(programNameInput);
}

function addProgramSave(editor) {
  const saveButton = document.createElement('button');
  saveButton.innerHTML = 'Save';
  saveButton.addEventListener('click', () => {
    const programName = document.querySelector('#program-name').value;
    const code = JSON.stringify(editor.getValue());
    worldStorage.putProgram(programName, code);
  });
  document.body.appendChild(saveButton);
}

async function initialize() {
  updateWorldStorage();
  addCss('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/codemirror.min.css');
  await loadJavaScriptFile('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/codemirror.js')
  await loadJavaScriptFile('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/mode/javascript/javascript.min.js');
  await loadJavaScriptFile('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/keymap/vim.min.js');
  await loadJavaScriptFile('amazon-cognito-auth.min.js');

  console.log(CodeMirror);
  const editor = CodeMirror(document.body, {
    value: initializationCode,
    lineNumbers: true,
    mode: 'javascript',
    keyMap: 'vim'
  });
  editor.setSize('100%', '100%');
  addExecuteButton(editor);
  addProgramNameInput();
  addProgramSave(editor);
  worldStorage.putProgram('abc', 'def');


}

initialize(); 
