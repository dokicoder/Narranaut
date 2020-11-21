import { useCallback, useMemo, useContext, useEffect } from 'react';
import { atomFamily, useRecoilState } from 'recoil';
import 'firebase/storage';
import { useFirebaseUser } from './firebase';
import { FirebaseContext } from 'src/firebase';
import { useMountedState } from './utils';

export const createImageStore = atomFamily<string | null, string>({
  key: 'IMAGES',
  default: undefined,
});

// the default value for unset entries in localStorage is null, not undefined. this hack converts according to the semantics of the url state so we can work with that
const toStorableUrl = (url: string) => (url === null ? 'null' : url);
const fromStorableUrl = (url: string) => {
  if (url === null) {
    return undefined;
  }

  return url === 'null' ? null : url;
};

const getItem = (key: string) => fromStorableUrl(window.localStorage.getItem(key));
const setItem = (key: string, value: string) => window.localStorage.setItem(key, toStorableUrl(value));

export const useImageUrl = (entityId: string) => {
  const user = useFirebaseUser();
  const { fileStorage } = useContext(FirebaseContext);

  // semantics: undefined means not yet loaded, null means no image specified
  const [imageUrl, setImageUrl] = useRecoilState<string | null>(createImageStore(entityId));

  const isMounted = useMountedState();

  // TODO: if this paths needs to be altered, you have to also adjust the security rules under https://console.firebase.google.com/project/narranaut/storage/narranaut.appspot.com/rules
  const refPath = useMemo(() => user && entityId && `user/${user.uid}/${entityId}-image`, [user, entityId]);

  const fetchImageUrl = useCallback(() => {
    if (refPath) {
      const cachedUrl = getItem(refPath);

      // cached url in localStorage to avoid fetching
      if (cachedUrl !== undefined) {
        setImageUrl(cachedUrl);

        return;
      }

      fileStorage
        .ref(refPath)
        .getDownloadURL()
        // image updated
        .then(url => {
          setItem(refPath, url);

          if (isMounted()) {
            setImageUrl(url);
          }
        })
        // no image set
        .catch(() => {
          setItem(refPath, null);
          if (isMounted()) {
            setImageUrl(null);
          }
        });
    }
  }, [fileStorage, refPath, isMounted, setImageUrl]);

  useEffect(() => fetchImageUrl(), [fetchImageUrl]);

  // this handler does not only update the state, but also the cached value of the image
  const updateImageUrl = (url: string) => {
    setImageUrl(url);

    // setting to undefined triggers loading spinner, but cache is not updated - call updateImageUrl() with null to clear the image
    if (imageUrl !== undefined) {
      setItem(refPath, url);
    }
  };

  return { imageUrl, refPath, updateImageUrl };
};
