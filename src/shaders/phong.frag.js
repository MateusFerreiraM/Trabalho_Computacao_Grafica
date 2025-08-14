export default
`#version 300 es
precision highp float;

// Uniforms para a luz branca
uniform vec4 light_pos_white;
uniform vec4 light_amb_c_white;
uniform float light_amb_k_white;
uniform vec4 light_dif_c_white;
uniform float light_dif_k_white;
uniform vec4 light_esp_c_white;
uniform float light_esp_k_white;
uniform float light_esp_p_white;

// Uniforms para a luz amarela
uniform vec4 light_pos_yellow;
uniform vec4 light_amb_c_yellow;
uniform float light_amb_k_yellow;
uniform vec4 light_dif_c_yellow;
uniform float light_dif_k_yellow;
uniform vec4 light_esp_c_yellow;
uniform float light_esp_k_yellow;
uniform float light_esp_p_yellow;

in vec4 fPosition;
in vec4 fColor;
in vec4 fNormal;

out vec4 minhaColor;

void main() {
  // Posição da câmera é a origem (0,0,0) no espaço de visualização.
  vec4 cameraDir = normalize(-fPosition);

  // --- Cálculo para a luz branca ---
  vec4 viewLightPosWhite = light_pos_white;
  vec4 lightDirWhite = normalize(viewLightPosWhite - fPosition);
  vec4 halfVecWhite = normalize(lightDirWhite + cameraDir);

  // Componente difusa
  float fatorDifWhite = max(0.0, dot(lightDirWhite, fNormal));
  // Componente especular
  float fatorEspWhite = pow(max(0.0, dot(halfVecWhite, fNormal)), light_esp_p_white);

  // --- Cálculo para a luz amarela ---
  vec4 viewLightPosYellow = light_pos_yellow;
  vec4 lightDirYellow = normalize(viewLightPosYellow - fPosition);
  vec4 halfVecYellow = normalize(lightDirYellow + cameraDir);
  
  // Componente difusa
  float fatorDifYellow = max(0.0, dot(lightDirYellow, fNormal));
  // Componente especular
  float fatorEspYellow = pow(max(0.0, dot(halfVecYellow, fNormal)), light_esp_p_yellow);

  // --- Combina as contribuições de ambas as luzes ---
  // Ambient: A cor ambiente é a soma das cores ambiente das duas luzes.
  vec4 amb = fColor * (light_amb_k_white * light_amb_c_white + light_amb_k_yellow * light_amb_c_yellow);

  // Difusa: A cor difusa é a soma das contribuições difusas das duas luzes.
  vec4 dif = fColor * (fatorDifWhite * light_dif_k_white * light_dif_c_white + fatorDifYellow * light_dif_k_yellow * light_dif_c_yellow);

  // Especular: A cor especular é a soma das contribuições especulares das duas luzes.
  vec4 esp = fatorEspWhite * light_esp_k_white * light_esp_c_white + fatorEspYellow * light_esp_k_yellow * light_esp_c_yellow;

  minhaColor = amb + dif + esp;
}`