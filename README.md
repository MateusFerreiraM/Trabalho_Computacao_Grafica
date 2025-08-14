# Trabalho de Computação Gráfica – Cena 3D Interativa

> Projeto desenvolvido para a disciplina de Computação Gráfica, consistindo na criação de uma cena 3D renderizada em tempo real com WebGL 2. A aplicação carrega múltiplos modelos, aplica transformações independentes, utiliza um sistema de iluminação dinâmico com múltiplas fontes de luz e permite interação do usuário para manipulação da malha.

---

## ✨ Funcionalidades

* **Carregamento de Múltiplos Modelos:** Carrega e renderiza duas instâncias de modelos `.obj` (Armadillo e Bunny) de forma independente.
* **Transformações Complexas:**
    * O modelo maior (Armadillo) permanece na origem, rotacionando em torno do seu próprio eixo Y.
    * O modelo menor (Bunny) orbita o centro da cena em torno do eixo Z.
    * O tamanho relativo dos modelos é ajustado via código, com uma instância sendo 3x maior que a outra.
* **Câmera Orbital:** A cena é visualizada a partir de uma câmera que orbita suavemente ao redor dos objetos, no estilo "Matrix".
* **Iluminação Dinâmica (Modelo de Phong):**
    * **Luz Branca:** Uma fonte de luz branca que acompanha a posição da câmera, iluminando a cena do ponto de vista do observador.
    * **Luz Amarela:** Uma fonte de luz amarela com posição fixa no espaço, criando reflexos e tons distintos nos modelos.
* **Interação com a Malha:**
    * O usuário pode selecionar um vértice de cada modelo através de um campo de texto na interface.
    * A aplicação utiliza uma estrutura de dados **Half-Edge** para identificar e colorir de vermelho todos os triângulos que compõem a "estrela" do vértice selecionado.
* **Projeção Perspectiva:** A cena é renderizada utilizando projeção perspectiva para dar a sensação de profundidade.

---

## 🚀 Tecnologias Utilizadas

* **WebGL 2:** API principal para renderização de gráficos 2D e 3D no navegador.
* **JavaScript (ES6+):** Linguagem de programação base da aplicação, utilizando módulos para organização do código.
* **gl-Matrix:** Biblioteca de alta performance para operações com vetores e matrizes em JavaScript.
* **HTML5 & CSS3:** Para a estruturação da página e estilização da interface de controle, utilizando Flexbox para um layout responsivo.

---

## ⚙️ Como Executar o Projeto

Para executar este projeto, você precisa de um servidor web local. Isso é necessário porque o carregamento de módulos JavaScript (`type="module"`) é bloqueado por políticas de segurança (CORS) ao abrir o ficheiro `main.html` diretamente no navegador.

### Opção 1: Usando Python (Recomendado e Simples)

1.  Abra um terminal ou prompt de comando na pasta raiz do projeto.
2.  Se você tem **Python 3**, execute o comando:
    ```bash
    python -m http.server
    ```
3.  Se você tem **Python 2**, execute o comando:
    ```bash
    python -m SimpleHTTPServer
    ```
4.  Abra o seu navegador e acesse o endereço `http://localhost:8000`.

### Opção 2: Usando a Extensão "Live Server" no VS Code

1.  Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no Visual Studio Code.
2.  Com o projeto aberto no VS Code, clique com o botão direito no ficheiro `main.html`.
3.  Selecione "Open with Live Server". O projeto abrirá automaticamente no seu navegador.

---

## 🎓 Contexto Acadêmico

Este trabalho foi desenvolvido como parte dos requisitos de avaliação da disciplina de **Computação Gráfica**.

* **Professor:** Prof. Marcos de Oliveira Lage Ferreira

## 👥 Grupo

* [Lucas Silveira Serrano](https://github.com/SerranoZz)
* [Mateus Ferreira Machado](https://github.com/MateusFerreiraM)
* [Vitória Guidine Soares](https://github.com/vitoriaguidines)