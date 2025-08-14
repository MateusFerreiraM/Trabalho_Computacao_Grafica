export default
`#version 300 es
precision highp float;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

in vec4 position;
in vec4 color;
in vec4 normal;

out vec4 fPosition;
out vec4 fColor;
out vec4 fNormal;

void main() {
  mat4 modelView = u_view * u_model;

  // Transforma o vértice para o espaço do clipe.
  gl_Position  = u_projection * modelView * position;

  // Passa as variáveis para o shader de fragmentos.
  // A transformação da normal é feita aqui para otimizar.
  fPosition = modelView * position;
  fNormal = transpose(inverse(modelView)) * normal;
  fColor = color;
}`