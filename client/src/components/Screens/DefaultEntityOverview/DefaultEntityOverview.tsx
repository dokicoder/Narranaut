/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import { Fab } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { EntityCompactView, EntityDetailView } from '../../EntityView';
import { LoadingIndicator } from 'src/components/LoadingIndicator';
import { useEntityStore } from 'src/hooks';
import { useParams, useHistory } from 'react-router-dom';
import { Breadcrumbs } from 'src/components';
import { singularize } from 'src/utils';
import { ObjectEntity } from 'src/models';
import { useFirebaseUser } from './../../../hooks/firebase';
import { useEntityTypeStore } from './../../../hooks/entityTypeStore';
import { useMemo } from 'react';

export const DefaultEntityOverview: React.FC = () => {
  const user = useFirebaseUser();

  const { entityType: entityTypePlural, entityId } = useParams<{ entityType: string; entityId: string }>();
  const entityType = singularize(entityTypePlural);
  const { entities, updateEntity, addEntity } = useEntityStore(entityType);
  const { types } = useEntityTypeStore();

  const history = useHistory();

  const isNewEntity = entityId === 'create';

  const newEmptyEntity = useMemo(
    (): ObjectEntity =>
      isNewEntity && user && types
        ? ({
            uid: user.uid,
            name: '',
            type: types.find(type => type.name === entityType),
            properties: {},
            relationships: [],
            deleted: false,
          } as ObjectEntity)
        : undefined,
    [user, entityType, types, isNewEntity]
  );

  // TODO: error component
  if (!entityTypePlural) {
    return <div>Error: entity type was undefined</div>;
  }

  const selectedEntity = entityId && (entities?.find(({ id }) => id === entityId) || newEmptyEntity);

  const loading = !entities;

  const onSelectEntity = (id: string) => () => {
    history.push(`/${entityTypePlural}/${id}`);
  };

  const onViewEntityList = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    history.push(`/${entityTypePlural}`);
  };

  const updateCurrentOrSaveNewEntity = (entity: ObjectEntity) => {
    if (entity.id) {
      return updateEntity(entity);
    } else {
      return addEntity(entity).then(result => {
        onSelectEntity(result.id)();

        return Promise.resolve();
      });
    }
  };

  const breadcrumbItems: any = [{ label: `${entityTypePlural}`, handler: onViewEntityList, active: !selectedEntity }];

  if (isNewEntity) {
    breadcrumbItems.push({ label: `new ${entityType}`, active: true });
  } else if (selectedEntity) {
    breadcrumbItems.push({ label: selectedEntity.name, active: true });
  }

  return loading ? (
    <LoadingIndicator />
  ) : (
    <React.Fragment>
      <Breadcrumbs items={breadcrumbItems} />
      {selectedEntity ? (
        <EntityDetailView entity={selectedEntity} onSave={updateCurrentOrSaveNewEntity} />
      ) : (
        <div
          css={css`
            display: grid;
            grid-gap: 30px;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          `}
        >
          {entities.map(entity => (
            <EntityCompactView
              key={entity.id}
              onSelect={onSelectEntity(entity.id)}
              entity={entity}
              cCss={css`
                transition: 0.25s ease-in-out transform;
                :hover {
                  transform: scale(1.1);
                  z-index: 10;
                }
              `}
            />
          ))}
          <div
            css={css`
              height: 400px;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              align-items: center;
            `}
          >
            <Fab color="primary" onClick={onSelectEntity('create')}>
              <AddIcon />
            </Fab>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
