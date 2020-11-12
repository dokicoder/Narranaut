// the maximum size for list queries - see https://firebase.google.com/docs/firestore/query-data/queries#query_limitations
const CHUNK_SIZE = 10;

export const splitToChunks = <T>(list: T[]) => {
  const chunkList = [];

  let offset = 0;

  while (offset < list.length) {
    chunkList.push(list.slice(offset, offset + CHUNK_SIZE));
    offset += CHUNK_SIZE;
  }

  return chunkList;
};
