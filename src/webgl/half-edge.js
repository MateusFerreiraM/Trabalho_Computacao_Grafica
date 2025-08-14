/**
 * As classes Vertex, HalfEdge e Face formam a estrutura de dados Half-Edge.
 * Ela é usada para representar a topologia da malha de forma eficiente.
 */
export class Vertex {
  constructor(vid, x, y, z, normal, color = [0.5, 0.2, 0.4, 1.0]) {
    this.vid = vid;
    this.position = [x, y, z, 1];
    this.normal = normal;
    this.color = color;
    this.he = null; // Um half-edge saindo do vértice.
  }
}

export class HalfEdge {
  constructor(vertex) {
    this.vertex = vertex;
    this.next = null; // O próximo half-edge na face.
    this.face = null; // A face à qual pertence.
    this.opposite = null; // O half-edge oposto.
  }
}

export class Face {
  constructor(baseHe) {
    this.baseHe = baseHe; // Um half-edge da face.
  }
}

export class HalfEdgeDS {
  constructor() {
    this.vertices = [];
    this.halfEdges = [];
    this.faces = [];
  }


  // Constrói a estrutura Half-Edge a partir de coordenadas de vértices, índices de triângulos e normais.
  build(coords, trigs, normals) {
    // 1. Constrói os vértices.
    for (let vid = 0; vid < coords.length; vid += 4) {
      const v = new Vertex(vid / 4, coords[vid], coords[vid + 1], coords[vid + 2],
                           [normals[vid], normals[vid + 1], normals[vid + 2], normals[vid + 3]]);
      this.vertices.push(v);
    }

    // 2. Constrói as faces e half-edges.
    for (let tid = 0; tid < trigs.length; tid += 3) {
      const v0 = this.vertices[trigs[tid + 0]];
      const v1 = this.vertices[trigs[tid + 1]];
      const v2 = this.vertices[trigs[tid + 2]];

      const he0 = new HalfEdge(v0);
      const he1 = new HalfEdge(v1);
      const he2 = new HalfEdge(v2);

      const face = new Face(he0);
      this.faces.push(face);

      he0.face = he1.face = he2.face = face;
      he0.next = he1;
      he1.next = he2;
      he2.next = he0;

      this.halfEdges.push(he0, he1, he2);
    }

    // 3. Calcula as referências opostas.
    this.computeOpposites();
    // 4. Associa um half-edge a cada vértice.
    this.computeVertexHe();
  }

  // Encontra e atribui o half-edge oposto para cada half-edge.
  computeOpposites() {
    const visited = {};

    for (let hid = 0; hid < this.halfEdges.length; hid ++) {
      const he = this.halfEdges[hid];
      const a = he.vertex.vid;
      const b = he.next.vertex.vid;
      const k = `k${Math.min(a, b)},${Math.max(a, b)}`;

      if (visited[k] !== undefined) {
        const op = visited[k];
        op.opposite = he;
        he.opposite = op;
        delete visited[k];
      }
      else {
        visited[k] = he;
      }
    }
  }

  
  // Associa o primeiro half-edge de saída a cada vértice.
  computeVertexHe() {
    for (const he of this.halfEdges) {
      const v = he.vertex;
      if (v.he === null) {
        v.he = he;
      }
    }
  }

  // Retorna os buffers de vértice e índices para uso no WebGL.
  getVBOs() {
    const coords = [];
    const colors = [];
    const normals = [];
    const indices = [];

    for (const v of this.vertices) {
      coords.push(...v.position);
      colors.push(...v.color);
      normals.push(...v.normal);
    }

    for (const he of this.halfEdges) {
      indices.push(he.vertex.vid);
    }

    return [coords, colors, normals, indices];
  }

  /**
   * Pinta a "estrela" de um vértice (todos os triângulos adjacentes).
   * A lógica percorre os half-edges ao redor do vértice.
   */
  estrela(vId) {
    const startHe = this.vertices[vId].he;
    if (!startHe) {
      return;
    }

    let currentHe = startHe;
    do {
      // Pinta os 3 vértices da face atual.
      currentHe.vertex.color = [1.0, 0.0, 0.0, 1.0];
      currentHe.next.vertex.color = [1.0, 0.0, 0.0, 1.0];
      currentHe.next.next.vertex.color = [1.0, 0.0, 0.0, 1.0];

      // Move para a próxima face adjacente.
      currentHe = currentHe.opposite.next;
    } while (currentHe !== startHe && currentHe !== null);
  }
}