import Camera from './webgl/camera.js';
import Light from './webgl/light.js';
import Mesh from './webgl/mesh.js';

// A classe Scene gerencia a configuração e o loop de renderização da cena.
class Scene {
  constructor(gl) {
    this.cam = new Camera(gl);

    // Inicializa as duas fontes de luz da cena.
    // A luz branca acompanha a câmera.
    this.whiteLight = new Light(this.cam.pos, [1.0, 1.0, 1.0, 1.0]);
    // A luz amarela tem uma posição fixa.
    this.yellowLight = new Light([0.0, 5.0, 0.0], [1.0, 1.0, 0.0, 0.5]);
  }
  
  // Carrega os modelos 3D, inicializa os shaders e VAOs, e configura os listeners de eventos.
  async init(gl) {
    // Inicializa o modelo do Armadillo.
    // É o modelo maior, centralizado na origem e rotaciona em Y.
    this.armadillo = new Mesh([0, 0, 0], [1, 1, 1], 0.007, 0);
    await this.armadillo.loadMeshV4(gl, '../../assets/obj/armadillo.obj');
    this.armadillo.init(gl, this.whiteLight, this.yellowLight);
    
    // Inicializa o modelo do coelho (Bunny).
    // É o modelo menor, afastado da origem e rotaciona em Z.
    // A escala é calculada para ser 3 vezes menor que o Armadillo.
    const scaleFactor = (this.armadillo.lengthX / 3) / 3.11398;
    this.bunny = new Mesh([-3.5, 0, 0], [scaleFactor, scaleFactor, scaleFactor], 0, 0.003);
    await this.bunny.loadMeshV4(gl, '../../assets/obj/bunny.obj');
    this.bunny.init(gl, this.whiteLight, this.yellowLight);

    // Adiciona os listeners para seleção de vértices.
    this.armadillo.addVertexSelectionListener(gl, 'model1-vertex');
    this.bunny.addVertexSelectionListener(gl, 'model2-vertex');
  }

  // Desenha a cena. Este método é chamado a cada frame.
  draw(gl) {  
    // Atualiza a posição da câmera e a luz branca que a acompanha.
    this.cam.updateCam();
    const pos = this.cam.pos;
    this.whiteLight.setPos(pos[0], pos[1], pos[2], gl, this.armadillo.program, this.bunny.program, 'white');

    // Desenha os dois modelos na cena.
    this.armadillo.draw(gl, this.cam);
    this.bunny.draw(gl, this.cam);
  }
}

// A classe principal que inicializa o WebGL e o loop de renderização.
class Main {
  constructor() {
    const canvas = document.querySelector("#glcanvas");
    this.gl = canvas.getContext("webgl2");

    if (!this.gl) {
      alert('Seu navegador não suporta WebGL 2.0');
      return;
    }

    this.setViewport();
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.scene = new Scene(this.gl);
    this.scene.init(this.gl).then(() => {
      this.draw();
    });
  }

  /**
   * Configura o tamanho do viewport do canvas.
   * Ela lê o tamanho real do elemento canvas (definido pelo CSS)
   * e ajusta a resolução do desenho para que seja a mesma, garantindo máxima qualidade.
   */
  setViewport() {
    const gl = this.gl;
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Lê as dimensões que o CSS deu ao canvas
    const displayWidth = gl.canvas.clientWidth;
    const displayHeight = gl.canvas.clientHeight;

    // Verifica se o tamanho do buffer de desenho é diferente do tamanho de exibição
    if (gl.canvas.width !== displayWidth * devicePixelRatio || gl.canvas.height !== displayHeight * devicePixelRatio) {
      // Ajusta o tamanho do buffer de desenho para corresponder ao tamanho de exibição
      gl.canvas.width = displayWidth * devicePixelRatio;
      gl.canvas.height = displayHeight * devicePixelRatio;
    }

    // Define o viewport do WebGL para corresponder ao novo tamanho
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }

  // O loop principal de renderização.
  draw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.scene.draw(this.gl);
    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = () => {
  const app = new Main();
}