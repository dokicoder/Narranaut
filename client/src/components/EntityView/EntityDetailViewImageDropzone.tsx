/** @jsx jsx */
import React, { useCallback, useContext, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { css, jsx } from '@emotion/core';
import firebase from 'firebase/app';
import 'firebase/storage';
import { FirebaseContext } from 'src/firebase';
import { useEffect } from 'react';
import { useFirebaseUser } from './../../hooks/firebase';

interface Props {
  id: string;
}

export const EntityDetailViewImageDropzone: React.FC<Props> = ({ id }) => {
  const { fileStorage } = useContext(FirebaseContext);
  const user = useFirebaseUser();

  const [imageUrl, setImgUrl] = useState<string>();

  // TODO: if this paths needs to be altered, you have to also adjust the security rules under https://console.firebase.google.com/project/narranaut/storage/narranaut.appspot.com/rules
  const refPath = useMemo(() => user && `user/${user.uid}/${id}-image`, [user, id]);

  const fetchImageUrl = useCallback(() => {
    if (refPath) {
      fileStorage.ref(refPath).getDownloadURL().then(setImgUrl);
    }
  }, [fileStorage, refPath]);

  useEffect(() => fetchImageUrl(), [fetchImageUrl]);

  const onDrop = useCallback(
    ([imageFile]: File[]) => {
      const uploadTask = fileStorage.ref(refPath).put(imageFile);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        },
        // error handler: this resets the old image - TODO: at the cost of a probably unnecessary refetch
        () => fetchImageUrl(),
        // success handler: this sets the new image URI
        () =>
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            setImgUrl(downloadURL);
          })
      );
    },
    [fileStorage, refPath, fetchImageUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      css={css`
        height: 300px;
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
      `}
    >
      {isDragActive ? (
        <p>Drop image here ...</p>
      ) : (
        <React.Fragment>
          <input {...getInputProps()} />
          <img
            css={css`
              height: 100%;
            `}
            src={imageUrl}
          />
        </React.Fragment>
      )}
    </div>
  );
};
