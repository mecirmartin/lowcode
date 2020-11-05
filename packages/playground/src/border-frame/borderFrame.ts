import svelte from 'svelte/compiler';

import { cloneElement, removeElement } from '../util/cacheHandlers';
import { getOffset } from '../util/highlight';
interface HTMLBodyElementWithMeta extends HTMLBodyElement {
  __svelte_meta: {
    loc: {
      file: string;
      line: number;
      column: number;
      char: number;
    };
  };
}

const iFrame = document.querySelector('iframe');
const innerDoc = iFrame!.contentDocument || iFrame!.contentWindow!.document;

export const addBorderFrame = (innerDoc: Document) => {
  const root = innerDoc.querySelector('body');

  root?.addEventListener('mouseover', (e: MouseEvent) => {
    const target = <HTMLBodyElementWithMeta>e.target;
    if (target === root || !target) return;
    const styles = getOffset(target);

    const mainDiv = document.getElementById('buttonContainer')!;
    const cloneIcon = document.getElementById('cloneIcon');
    const removeIcon = document.getElementById('removeIcon');
    const icons = mainDiv.children[0].children[0].children;

    for (let i = 0; i < icons.length; i++) {
      if (icons[i] === target) return;
    }

    cloneIcon!.onclick = async () => {
      if (target.__svelte_meta) {
        await cloneElement(target.__svelte_meta);
        iFrame?.contentWindow?.location.reload();
      } else console.warn('Something went wrong');
    };

    removeIcon!.onclick = async () => {
      if (target.__svelte_meta) {
        await removeElement(target.__svelte_meta);
        iFrame?.contentWindow?.location.reload();
      } else console.warn('Something went wrong');
    };

    mainDiv.setAttribute(
      'style',
      `height:${styles.height}px; width:${styles.width}px; transform:translate3d(${styles.left}px, ${styles.top}px, 0px)`,
    );
  });
};

addBorderFrame(innerDoc);
