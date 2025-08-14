import vertShaderSrc from '../shaders/phong.vert.js';
import fragShaderSrc from '../shaders/phong.frag.js';
import Shader from '../shaders/shader.js';
import { HalfEdgeDS } from '../webgl/half-edge.js';


// A classe Mesh representa um modelo 3D, incluindo sua geometria, shaders e transformações de modelo.
export default class Mesh {
  constructor(vetTranslate, vetScale, rotateY, rotateZ) {
    // Estrutura de dados para o modelo (Half-Edge Data Structure).
    this.heds = new HalfEdgeDS();

    // Matriz de modelagem
    this.translate = vetTranslate;
    this.scale = vetScale;
    this.rotateY = rotateY;
    this.rotateZ = rotateZ;
    this.angleY = 0;
    this.angleZ = 0;
    this.model = mat4.create();
    
    // Shader program
    this.program = null;
    
    // Localizações dos dados no buffer e uniformes
    this.vaoLoc = -1;
    this.indicesLoc = -1;
    this.uModelLoc = -1;
    this.uViewLoc = -1;
    this.uProjectionLoc = -1;

    // Dimensões do modelo para cálculo de escala.
    this.tamanhoCoords = -1;
    this.x = [];
    this.y = [];
    this.z = [];
  }

  // Carrega a malha de um arquivo OBJ e constrói a Half-Edge DS.
  async loadMeshV4(gl, path) {
    const resp = await fetch(path);
    const text = await resp.text();
    
    const txtList = text.split('\n');
    
    const coords = [];
    const normals = [];
    const indices = [];
    
    for(let i = 0; i < txtList.length; i++){
      let subString = txtList[i].split(' ');

      if(subString[0] === 'v'){
        coords.push(parseFloat(subString[1]), parseFloat(subString[2]), parseFloat(subString[3]), 1);
        // Coleta as coordenadas para calcular as dimensões.
        this.x.push(parseFloat(subString[1]));
        this.y.push(parseFloat(subString[2]));
        this.z.push(parseFloat(subString[3]))
      }
      else if(subString[0] === 'vn'){
        normals.push(parseFloat(subString[1]), parseFloat(subString[2]), parseFloat(subString[3]), 0);
      }
      else if(subString[0] === 'f'){
        // Processa as faces, ignorando coordenadas de textura.
        let x = subString[1].split('//');
        let y = subString[2].split('//');
        let z = subString[3].split('//');
        indices.push(parseInt(x[0]) - 1, parseInt(y[0]) - 1, parseInt(z[0]) - 1);
      }
    }
    
    this.heds.build(coords, indices, normals);
    this.tamanhoCoords = coords.length / 4;
  }

  /**
   * Adiciona um listener de evento para a seleção de vértices.
   * Quando o usuário insere um ID de vértice e pressiona Enter, a
   * "estrela" do vértice é colorida de vermelho.
   */
  addVertexSelectionListener(gl, model) {
    const modelVertexInput = document.getElementById(`${model}`);
    const nome = (model === "model1-vertex") ? "Armadillo" : "Coelho";

    modelVertexInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const modelVertex = parseInt(modelVertexInput.value);
        if (isNaN(modelVertex) || modelVertex < 1 || modelVertex > this.tamanhoCoords) {
          alert(`Vértice inválido! Digite um valor entre 1 e ${this.tamanhoCoords}.`);
        } 
        else {
          this.heds.estrela(modelVertex - 1); // IDs de vértice são 0-indexados.
          this.createVAO(gl); // Reconstroi o VAO para atualizar as cores.
          alert(`A região ligada ao vértice ${modelVertex} do ${nome} foi pintada!`);
        }        
      }
    });
  }
  
  // Cria os shaders e o programa.
  createShader(gl) {
    const vertShd = Shader.createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    const fragShd = Shader.createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    this.program = Shader.createProgram(gl, vertShd, fragShd);
    gl.useProgram(this.program);
  }

  // Obtém a localização das variáveis uniformes.
  createUniforms(gl) {
    this.uModelLoc = gl.getUniformLocation(this.program, "u_model");
    this.uViewLoc = gl.getUniformLocation(this.program, "u_view");
    this.uProjectionLoc = gl.getUniformLocation(this.program, "u_projection");
  }

  // Cria o Vertex Array Object (VAO) e os buffers associados.
  createVAO(gl) {
    const vbos = this.heds.getVBOs();

    const coordsAttributeLocation = gl.getAttribLocation(this.program, "position");
    const coordsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[0]));

    const colorsAttributeLocation = gl.getAttribLocation(this.program, "color");
    const colorsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[1]));

    const normalsAttributeLocation = gl.getAttribLocation(this.program, "normal");
    const normalsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[2]));

    this.vaoLoc = Shader.createVAO(gl,
      coordsAttributeLocation, coordsBuffer, 
      colorsAttributeLocation, colorsBuffer, 
      normalsAttributeLocation, normalsBuffer);

    this.indicesLoc = Shader.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(vbos[3]));
  }  

  // Inicializa a malha: cria shaders, uniformes, VAO e luzes.
  init(gl, light0, light1) {
    this.createShader(gl);
    this.createUniforms(gl);
    this.createVAO(gl);

    // Configura as luzes no shader.
    light0.createUniforms(gl, this.program, 'white');
    light1.createUniforms(gl, this.program, 'yellow');
  }

  /**
   * Atualiza a matriz de modelagem (transformações).
   * A ordem das transformações é crucial para o resultado correto.
   * Para criar uma órbita, a rotação em torno da origem deve ser
   * aplicada antes da translação que afasta o objeto do centro.
   */
  updateModelMatrix() {
    // Incrementa os ângulos de rotação a cada frame.
    this.angleY += this.rotateY;
    this.angleZ += this.rotateZ;

    // Reinicia a matriz do modelo para a matriz identidade.
    mat4.identity(this.model);
    
    // 1. Rotação: Gira o sistema de coordenadas em torno da origem.
    // O Armadillo irá girar em Y e o Coelho em Z.
    // Esta operação define a posição orbital do objeto.
    mat4.rotateY(this.model, this.model, this.angleY);
    mat4.rotateZ(this.model, this.model, this.angleZ);
    
    // 2. Translação: Move o objeto para longe da origem ao longo dos eixos
    // que acabaram de ser girados.
    mat4.translate(this.model, this.model, this.translate);
    
    // 3. Escala: Aplica a escala ao objeto.
    // Geralmente, a escala pode ser aplicada no final sem problemas
    // para este tipo de transformação.
    mat4.scale(this.model, this.model, this.scale);
  }

  // Desenha a malha na tela.
  draw(gl, cam) {
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.useProgram(this.program);

    this.updateModelMatrix();

    // Obtém as matrizes de transformação da câmera.
    const model = this.model;
    const view = cam.getView();
    const proj = cam.getProj();
    
    gl.uniformMatrix4fv(this.uModelLoc, false, model);
    gl.uniformMatrix4fv(this.uViewLoc, false, view);
    gl.uniformMatrix4fv(this.uProjectionLoc, false, proj);

    gl.bindVertexArray(this.vaoLoc);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesLoc);

    gl.drawElements(gl.TRIANGLES, this.heds.faces.length * 3, gl.UNSIGNED_INT, 0);

    gl.disable(gl.CULL_FACE);
  }

  // Getters para as dimensões da malha, úteis para cálculos de escala.
  get lengthX() { return Math.max(...this.x) - Math.min(...this.x); }
  get lengthY() { return Math.max(...this.y) - Math.min(...this.y); }
  get lengthZ() { return Math.max(...this.z) - Math.min(...this.z); }
}