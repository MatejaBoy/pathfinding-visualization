export interface NodeMinHeapInterface {
  x: number;
  y: number;
  dist: number;
  prev?: { x: number; y: number };
}

export default class NodeMinHeap {
  arr: NodeMinHeapInterface[];

  constructor() {
    this.arr = [];
  }

  left(i: number) {
    return i * 2 + 1;
  }

  right(i: number) {
    return i * 2 + 2;
  }

  parent(i: number) {
    return Math.ceil(i / 2 - 1);
  }

  getMin() {
    return this.arr[0];
  }

  findByCoords(x: number, y: number) {
    for (let i = 0; i < this.arr.length; i++) {
      if (this.arr[i].x === x && this.arr[i].y === y) {
        return i;
      }
    }
    return -1;
  }

  // Method:
  // 1) Push to the value at the end of the array
  // 2) We check if the inserted element is smaller if its parent
  // 3) If so, we swap the two values
  // 4) We do the same one level higher
  insert(k: NodeMinHeapInterface) {
    let arr = this.arr;
    arr.push(k);
    let i = arr.length - 1;
    while (i > 0 && arr[this.parent(i)].dist > arr[i].dist) {
      let p = this.parent(i); // Index of parent node
      [arr[p], arr[i]] = [arr[i], arr[p]]; // If the child is smaller than the parent, we swap the two
      i = p;
    }
  }

  // Decrease the value of an already existing key in the arr
  decreaseKey(i: number, new_val: number) {
    let arr = this.arr;
    arr[i].dist = new_val;
    while (i > 0 && arr[this.parent(i)].dist > arr[i].dist) {
      let p = this.parent(i);
      [arr[p], arr[i]] = [arr[i], arr[p]];
      i = p;
    }
  }

  // Remove and return the minimum element (root)
  // 1) If: there's only one element in the list, we remove and return that one
  // 2) Else: We set the first element's value as the last element's value and remove the last element
  // 3) Heapify the list -> reorder the list so that the heap criteria is satisfied
  extractMin() {
    let arr = this.arr;
    if (arr.length == 1) {
      return arr.pop();
    }

    let res = arr[0];
    arr[0] = arr[arr.length - 1];
    arr.pop();
    this.heapify(0);

    return res;
  }

  // We the delete a key by putting it at root position by decreasing
  // its value to be lower than the current root node
  delete(i: number) {
    this.decreaseKey(i, this.arr[0].dist - 1);
    this.extractMin();
  }

  // Heapify
  //
  heapify(i: number) {
    let arr = this.arr;
    let n = arr.length;
    let l = this.left(i);
    let r = this.right(i);
    let smallest = i;

    // The goal of these are determining the smallest value from the parent and its children
    // Firstly we check if l and r even exist in the array (l < n)
    // Secondly the check if the left node is smaller than the parent
    if (l < n && arr[l].dist < arr[i].dist) {
      smallest = l;
    }
    if (r < n && arr[r].dist < arr[smallest].dist) {
      smallest = r;
    }

    // If the parent isn't the smallest, the swap it with the children
    if (smallest !== i) {
      [arr[smallest], arr[i]] = [arr[i], arr[smallest]];
      this.heapify(smallest);
    }

    return;
  }

  //
}

export class MinHeap {
  arr: number[];

  constructor() {
    this.arr = [];
  }

  left(i: number) {
    return i * 2 + 1;
  }

  right(i: number) {
    return i * 2 + 2;
  }

  parent(i: number) {
    return Math.ceil(i / 2 - 1);
  }

  getMin() {
    return this.arr[0];
  }

  // Method:
  // 1) Push to the value at the end of the array
  // 2) We check if the inserted element is smaller if its parent
  // 3) If so, we swap the two values
  // 4) We do the same one level higher
  insert(k: number) {
    let arr = this.arr;
    arr.push(k);
    let i = arr.length - 1;
    while (i > 0 && arr[this.parent(i)] > arr[i]) {
      let p = this.parent(i); // Index of parent node
      [arr[p], arr[i]] = [arr[i], arr[p]]; // If the child is smaller than the parent, we swap the two
      i = p;
    }
  }

  // Decrease the value of an already existing key in the arr
  decreaseKey(i: number, new_val: number) {
    let arr = this.arr;
    arr[i] = new_val;
    while (i > 0 && arr[this.parent(i)] > arr[i]) {
      let p = this.parent(i);
      [arr[p], arr[i]] = [arr[i], arr[p]];
      i = p;
    }
  }

  // Remove and return the minimum element (root)
  // 1) If: there's only one element in the list, we remove and return that one
  // 2) Else: We set the first element's value as the last element's value and remove the last element
  // 3) Heapify the list -> reorder the list so that the heap criteria is satisfied
  extractMin() {
    let arr = this.arr;
    if (arr.length == 1) {
      return arr.pop();
    }

    let res = arr[0];
    arr[0] = arr[arr.length - 1];
    arr.pop();
    this.heapify(0);

    return res;
  }

  // We the delete a key by putting it at root position by decreasing
  // its value to be lower than the current root node
  delete(i: number) {
    this.decreaseKey(i, this.arr[0] - 1);
    this.extractMin();
  }

  // Heapify
  //
  heapify(i: number) {
    let arr = this.arr;
    let n = arr.length;
    let l = this.left(i);
    let r = this.right(i);
    let smallest = i;

    // The goal of these are determining the smallest value from the parent and its children
    // Firstly we check if l and r even exist in the array (l < n)
    // Secondly the check if the left node is smaller than the parent
    if (l < n && arr[l] < arr[i]) {
      smallest = l;
    }
    if (r < n && arr[r] < arr[smallest]) {
      smallest = r;
    }

    // If the parent isn't the smallest, the swap it with the children
    if (smallest !== i) {
      [arr[smallest], arr[i]] = [arr[i], arr[smallest]];
      this.heapify(smallest);
    }

    return;
  }

  //
}
