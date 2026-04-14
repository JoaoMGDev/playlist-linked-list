export interface SongData {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

export class Node {
  data: SongData;
  next: Node | null;

  constructor(data: SongData) {
    this.data = data;
    this.next = null;
  }
}

export interface OperationResult<T = void> {
  result: T;
  steps: number;
  operation: string;
}

export class LinkedList {
  head: Node | null = null;
  size: number = 0;

  insert(data: SongData): OperationResult {
    const newNode = new Node(data);
    let steps = 0;

    if (!this.head) {
      this.head = newNode;
      this.size++;
      return { result: undefined, steps, operation: `Inserção de "${data.title}"` };
    }

    let current = this.head;
    steps++;
    while (current.next) {
      current = current.next;
      steps++;
    }
    current.next = newNode;
    this.size++;
    return { result: undefined, steps, operation: `Inserção de "${data.title}"` };
  }

  remove(id: string): OperationResult<SongData | null> {
    let steps = 0;

    if (!this.head) {
      return { result: null, steps, operation: "Remoção (lista vazia)" };
    }

    if (this.head.data.id === id) {
      steps++;
      const removed = this.head.data;
      this.head = this.head.next;
      this.size--;
      return { result: removed, steps, operation: `Remoção de "${removed.title}"` };
    }

    let current = this.head;
    steps++;
    while (current.next) {
      steps++;
      if (current.next.data.id === id) {
        const removed = current.next.data;
        current.next = current.next.next;
        this.size--;
        return { result: removed, steps, operation: `Remoção de "${removed.title}"` };
      }
      current = current.next;
    }

    return { result: null, steps, operation: "Remoção (não encontrado)" };
  }

  search(query: string): OperationResult<Node | null> {
    let steps = 0;
    let current = this.head;
    const q = query.toLowerCase();

    while (current) {
      steps++;
      if (
        current.data.title.toLowerCase().includes(q) ||
        current.data.artist.toLowerCase().includes(q)
      ) {
        return { result: current, steps, operation: `Busca por "${query}"` };
      }
      current = current.next;
    }

    return { result: null, steps, operation: `Busca por "${query}"` };
  }

  moveNode(fromIndex: number, toIndex: number): OperationResult {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= this.size || toIndex >= this.size) {
      return { result: undefined, steps: 0, operation: "Movimentação (índice inválido)" };
    }

    let steps = 0;

    // Remove node at fromIndex
    let removed: Node;
    if (fromIndex === 0) {
      steps++;
      removed = this.head!;
      this.head = this.head!.next;
    } else {
      let prev = this.head!;
      steps++;
      for (let i = 0; i < fromIndex - 1; i++) {
        prev = prev.next!;
        steps++;
      }
      removed = prev.next!;
      prev.next = removed.next;
      steps++;
    }
    removed.next = null;

    // Insert at toIndex
    if (toIndex === 0) {
      removed.next = this.head;
      this.head = removed;
      steps++;
    } else {
      let prev = this.head!;
      steps++;
      for (let i = 0; i < toIndex - 1; i++) {
        prev = prev.next!;
        steps++;
      }
      removed.next = prev.next;
      prev.next = removed;
      steps++;
    }

    return { result: undefined, steps, operation: `Mover "${removed.data.title}" da posição ${fromIndex} para ${toIndex}` };
  }

  getIndexById(id: string): number {
    let current = this.head;
    let index = 0;
    while (current) {
      if (current.data.id === id) return index;
      current = current.next;
      index++;
    }
    return -1;
  }

  toArray(): SongData[] {
    const arr: SongData[] = [];
    let current = this.head;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }
}
