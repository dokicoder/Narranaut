/** @jsx jsx */
import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import { useDropzone } from 'react-dropzone';
import { Paper, CircularProgress } from '@material-ui/core';
import { css, jsx, SerializedStyles } from '@emotion/core';
import { FirebaseContext } from 'src/firebase';
import { PlaceholderImages } from 'src/utils';
import { useFirebaseUser } from 'src/hooks/firebase';
import { MainTheme } from 'src/utils/themes';

interface Props {
  entityId: string;
  entityType?: string;
  cCss?: SerializedStyles;
}

type FileRejectionError = 'file-too-large' | 'file-invalid-type';

interface IFileRejection {
  errors: { code: FileRejectionError }[];
}

const fileRejectionErrorMessageMap: Record<FileRejectionError, string> = {
  'file-too-large': 'The max image size is 250KB',
  'file-invalid-type': 'Upload a .png or .jpg image',
};

const mapRejectionToMessage = (rejection: IFileRejection): string =>
  fileRejectionErrorMessageMap[rejection.errors[0].code];

export const EntityDetailViewImageDropzone: React.FC<Props> = ({ entityId, entityType, cCss }) => {
  const { fileStorage } = useContext(FirebaseContext);
  const user = useFirebaseUser();

  // semantics: undefined means not yet loaded, null means no image specified
  const [imageUrl, setImageUrl] = useState<string | null>(entityId ? undefined : null);

  const [fileRejectionErrorMessage, setFileRejectionErrorMessage] = useState<string>();

  // TODO: if this paths needs to be altered, you have to also adjust the security rules under https://console.firebase.google.com/project/narranaut/storage/narranaut.appspot.com/rules
  const refPath = useMemo(() => user && entityId && `user/${user.uid}/${entityId}-image`, [user, entityId]);

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
    ([imageFile]: File[], [rejection]: any[]) => {
      if (rejection) {
        setFileRejectionErrorMessage(mapRejectionToMessage(rejection as IFileRejection));
      }
      if (!imageFile) return;

      setImageUrl(undefined);

      const uploadTask = fileStorage.ref(refPath).put(imageFile);

      // listen for errors and completion of upload to firebase storage
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        null,
        // error handler: this resets the old image - TODO: at the cost of a probably unnecessary refetch
        () => fetchImageUrl(),
        // success handler: this sets the new image URI
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(setImageUrl)
            .catch(() => {
              // no image set
              setImageUrl(null);
            });

          setFileRejectionErrorMessage(undefined);
        }
      );
    },
    [fileStorage, refPath, fetchImageUrl]
  );

  const disabled = !refPath;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
    disabled,
    multiple: false,
    maxSize: 262144,
  });

  return (
    <Paper
      css={[
        css`
          transition: background 0.4s ease-in-out;
          background: ${imageUrl === undefined ? 'white' : MainTheme.palette.primary.dark};
          overflow: hidden;
          ${refPath ? 'cursor: pointer;' : ''}
        `,
        cCss,
      ]}
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
        {
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
                    opacity: 0.27;
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
                <CircularProgress color="secondary" />
              </div>
            )}
            {imageUrl === null && !disabled && !isDragActive && !fileRejectionErrorMessage && (
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
            {imageUrl !== undefined && !disabled && !isDragActive && (
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
                {fileRejectionErrorMessage}
              </div>
            )}
            {isDragActive && (
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
                drop image here to upload
              </div>
            )}
          </React.Fragment>
        }
      </div>
    </Paper>
  );
};
