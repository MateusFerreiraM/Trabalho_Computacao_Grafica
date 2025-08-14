export default class Camera {
  constructor(gl) {
    // Posição da camera
    this.angle = 0.1;

    this.eye = vec3.fromValues(0.0, 3.0, 5.0);
    this.at  = vec3.fromValues(0.0, 0.0, 0.0);
    this.up  = vec3.fromValues(0.0, 1.0, 0.0);

    // Parâmetros da projeção
    this.fovy = Math.PI / 2;
    this.aspect = gl.canvas.width / gl.canvas.height;
    this.near = 0.1;
    this.far = 100.0;

    // Matrizes View e Projection
    this.view = mat4.create();
    this.proj = mat4.create();
  }

  getView() {
    return this.view;
  }

  getProj() {
    return this.proj;
  }

  get pos() {
    return this.eye;
  }

  // Atualiza a matriz de visualização (View matrix).
  updateViewMatrix() {
    mat4.identity(this.view);
    mat4.lookAt(this.view, this.eye, this.at, this.up);
  }

  // Atualiza a matriz de projeção (Projection matrix).
  updateProjectionMatrix() {
    mat4.identity(this.proj);
    mat4.perspective(this.proj, this.fovy, this.aspect, this.near, this.far);
  }

  // Simula a órbita da câmera ao redor da cena.
  rotateAroundScene() {
    const radius = 5.0;
    const speed = 0.003;

    this.angle += speed;

    this.eye[0] = radius * Math.sin(this.angle);
    this.eye[2] = radius * Math.cos(this.angle);

    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }

  updateCam() {
    this.rotateAroundScene();
  }
}