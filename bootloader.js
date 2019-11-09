const INITIALIZE_PROGRAM_KEY = 'initialize';

var worldStorage;
var executor;
var initializationCode;

class WorldStorage {
  
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  async getProgram(key) {
    const response = await fetch(
      `${this.baseUrl}/programs/${key}`, 
      {
        mode: 'cors'
      }
    );
    const jsonResponse = await response.json();
    return jsonResponse.programs[0].code.join('\n');
  }
}  

class Executor {
  load(programCode) {
    eval(programCode);
  }
}

async function initialize() {
  worldStorage = new WorldStorage('https://avpou559j3.execute-api.us-east-1.amazonaws.com/development');
  // initializationCode = await worldStorage.getProgram(INITIALIZE_PROGRAM_KEY);
  executor = new Executor();
  // executor.load(initializationCode);
}

initialize();


