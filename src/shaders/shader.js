// A classe Shader encapsula funções utilitárias para WebGL, como a criação e compilação de shaders, programas, buffers e VAOs.
export default class Shader {
  static createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      console.error('Could not compile WebGL program:' + info);
    }
    return shader;
  }

  static createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      console.error('Could not compile WebGL program:' + info);
    }
    return program;
  }

  static isArrayBuffer(value) {
    return value && value.buffer instanceof ArrayBuffer && value.byteLength !== undefined;
  }

  static createBuffer(gl, type, data) {
    if (data.length === 0) return null;
    if (!Shader.isArrayBuffer(data)) {
      console.warn('Data is not an instance of ArrayBuffer');
      return null;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    return buffer;
  }

  static createVAO(gl, posAttribLoc, posBuffer, colorAttribLoc = null, colorBuffer = null, normAttribLoc = null, normBuffer = null) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Configura o atributo de posição
    if (posAttribLoc !== null && posAttribLoc !== undefined) {
      gl.enableVertexAttribArray(posAttribLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.vertexAttribPointer(posAttribLoc, 4, gl.FLOAT, false, 0, 0);
    }

    // Configura o atributo de cor
    if (colorAttribLoc !== null && colorAttribLoc !== undefined) {
      gl.enableVertexAttribArray(colorAttribLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.vertexAttribPointer(colorAttribLoc, 4, gl.FLOAT, false, 0, 0);
    }

    // Configura o atributo de normal
    if (normAttribLoc !== null && normAttribLoc !== undefined) {
      gl.enableVertexAttribArray(normAttribLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
      gl.vertexAttribPointer(normAttribLoc, 4, gl.FLOAT, false, 0, 0);
    }

    gl.bindVertexArray(null); // Desvincula o VAO para evitar alterações acidentais.
    return vao;
  }
}