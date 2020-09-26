/** @jsx jsx */
import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { css, jsx, InterpolationWithTheme } from '@emotion/core';
import firebase from 'firebase/app';
import 'firebase/storage';
import { FirebaseContext } from 'src/firebase';
import { PlaceholderImages } from 'src/utils';
import { useFirebaseUser } from './../../hooks/firebase';
import { Paper, CircularProgress } from '@material-ui/core';

interface Props {
  entityId: string;
  entityType?: string;
  cCss?: InterpolationWithTheme<any>;
}

export const EntityDetailViewImageDropzone: React.FC<Props> = ({ entityId, entityType, cCss }) => {
  const { fileStorage } = useContext(FirebaseContext);
  const user = useFirebaseUser();

  // semantics: undefined means not yet loaded, null means no image specified
  const [imageUrl, setImageUrl] = useState<string | null>();

  // TODO: if this paths needs to be altered, you have to also adjust the security rules under https://console.firebase.google.com/project/narranaut/storage/narranaut.appspot.com/rules
  const refPath = useMemo(() => user && `user/${user.uid}/${entityId}-image`, [user, entityId]);

  const fetchImageUrl = useCallback(() => {
    if (refPath) {
      fileStorage
        .ref(refPath)
        .getDownloadURL()
        .then(setImageUrl)
        .catch(() => {
          // no image set
          setImageUrl(null);
        });
    }
  }, [fileStorage, refPath]);

  useEffect(() => fetchImageUrl(), [fetchImageUrl]);

  const placeholder = PlaceholderImages[entityType];

  const onDrop = useCallback(
    ([imageFile]: File[]) => {
      setImageUrl(undefined);

      const uploadTask = fileStorage.ref(refPath).put(imageFile);

      // listen for errors and completion of upload to firebase storage
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        null,
        // error handler: this resets the old image - TODO: at the cost of a probably unnecessary refetch
        () => fetchImageUrl(),
        // success handler: this sets the new image URI
        () =>
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            setImageUrl(downloadURL);
          })
      );
    },
    [fileStorage, refPath, fetchImageUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Paper
      css={
        [
          css`
            background: #8888cc;
            overflow: hidden;
          `,
          cCss,
        ] as any
      }
    >
      <div
        {...getRootProps()}
        css={css`
          height: 100%;
          width: 100%;
          display: flex;
          position: relative;
          flex-direction: column;
          align-items: stretch;
          justify-content: space-around;
        `}
      >
        {isDragActive ? (
          <p>Drop image here ...</p>
        ) : (
          <React.Fragment>
            <input {...getInputProps()} />
            {(imageUrl && (
              <img
                css={css`
                  height: 100%;
                  overflow: hidden;
                  object-fit: cover;
                `}
                src={imageUrl}
              />
            )) ||
              // when not loading image and there is a placeholder for this entity type
              (imageUrl === null && placeholder && (
                <img
                  css={css`
                    height: 100%;
                    opacity: 0.4;
                    object-fit: cover;
                  `}
                  src={placeholder}
                />
              ))}
            {imageUrl === undefined && (
              <div
                css={css`
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                `}
              >
                <CircularProgress />
              </div>
            )}
            {imageUrl === null && (
              <div
                css={css`
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  white-space: nowrap;
                  font-weight: bold;
                  color: white;
                `}
              >
                click to select an image
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </Paper>
  );
};
