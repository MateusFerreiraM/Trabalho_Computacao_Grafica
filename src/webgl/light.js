export default class Light {
  constructor(position, color) {
    this.pos = vec4.fromValues(position[0], position[1], position[2], 1.0);
    this.angle = 0;

    // Propriedades da luz: cor ambiente, difusa e especular.
    this.amb_c = vec4.fromValues(color[0], color[1], color[2], color[3]);
    this.amb_k = 0.2;

    this.dif_c = vec4.fromValues(color[0], color[1], color[2], 1.0);
    this.dif_k = 0.55;

    this.esp_c = vec4.fromValues(color[0], color[1], color[2], 1.0);
    this.esp_k = 0.25;
    this.esp_p = 100;
  }

  // Envia as propriedades da luz para o shader.
  createUniforms(gl, program, name) {
    gl.uniform4fv(gl.getUniformLocation(program, `light_pos_${name}`), this.pos);
    gl.uniform4fv(gl.getUniformLocation(program, `light_amb_c_${name}`), this.amb_c);
    gl.uniform1f(gl.getUniformLocation(program, `light_amb_k_${name}`), this.amb_k);
    gl.uniform4fv(gl.getUniformLocation(program, `light_dif_c_${name}`), this.dif_c);
    gl.uniform1f(gl.getUniformLocation(program, `light_dif_k_${name}`), this.dif_k);
    gl.uniform4fv(gl.getUniformLocation(program, `light_esp_c_${name}`), this.esp_c);
    gl.uniform1f(gl.getUniformLocation(program, `light_esp_k_${name}`), this.esp_k);
    gl.uniform1f(gl.getUniformLocation(program, `light_esp_p_${name}`), this.esp_p);
  }

  // Atualiza a posição da luz em ambos os programas de shader.
  setPos(x, y, z, gl, program0, program1, name) {
    this.pos = vec4.fromValues(x, y, z, 1.0);
    
    gl.useProgram(program0);
    gl.uniform4fv(gl.getUniformLocation(program0, `light_pos_${name}`), this.pos);

    gl.useProgram(program1);
    gl.uniform4fv(gl.getUniformLocation(program1, `light_pos_${name}`), this.pos);
  }
}