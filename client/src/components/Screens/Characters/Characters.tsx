/** @jsx jsx */
import React, { useEffect, useContext } from 'react';
import { useRecoilState } from 'recoil';
import { jsx, css } from '@emotion/core';
import { EntityView } from '../../EntityView';
import { charactersState } from '../../../store';
import { ObjectEntity } from 'src/models';
import { useFirebaseUser } from 'src/hooks';
import { FirebaseContext } from 'src/firebase';
import { LoadingIndicator } from 'src/components/LoadingIndicator';

const Characters: React.FC = () => {
  const [characters, updateCharacters] = useRecoilState(charactersState);
  const { db } = useContext(FirebaseContext);

  const user = useFirebaseUser();

  useEffect(() => {
    let unsubscribe: () => void;
    const getEntities = async () => {
      if (user) {
        const entitiesRef = db.collection('entities');

        unsubscribe = entitiesRef.where('uid', '==', user.uid).onSnapshot(({ docs }) => {
          const entities = docs.map(doc => ({ id: doc.id, ...doc.data() } as ObjectEntity));

          console.log(entities);

          updateCharacters(entities);
        });
      }
    };

    getEntities();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, db, updateCharacters]);

  const loading = !characters;

  return loading ? (
    <LoadingIndicator />
  ) : (
    <React.Fragment>
      <h1>Characters</h1>
      <div
        css={css`
          display: grid;
          grid-gap: 30px;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        `}
      >
        {characters.map(entity => (
          <EntityView
            key={entity.id}
            {...entity}
            cCss={css`
              transition: 0.25s ease-in-out transform;
              :hover {
                transform: scale(1.1);
                z-index: 10;
              }
            `}
          />
        ))}
      </div>
    </React.Fragment>
  );
};

export default Characters;
