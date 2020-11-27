/** @jsx jsx */
import React, { useMemo } from 'react';
import { jsx, css } from '@emotion/core';
import { Fab, Button, Fade } from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { EntityCompactView, EntityDetailView } from '../../EntityView';
import { LoadingIndicator } from 'src/components/LoadingIndicator';
import { useEntityStore } from 'src/hooks';
import { useParams, useHistory } from 'react-router-dom';
import { Breadcrumbs } from 'src/components';
import { singularize } from 'src/utils';
import { ObjectEntity } from 'src/models';
import { useFirebaseUser } from 'src/hooks/firebase';
import { useEntityTypeStore } from 'src/hooks/entityTypeStore';
import { useState } from 'react';

export const DefaultEntityOverview: React.FC = () => {
  const user = useFirebaseUser();

  const [showDeletedEntites, setShowDeletedEntites] = useState(false);

  const { entityType: entityTypePlural, entityId } = useParams<{ entityType: string; entityId: string }>();
  const entityType = singularize(entityTypePlural);
  const { entities: allEntities, updateEntity, addEntity, flagEntityDeleted, reallyDeleteEntity } = useEntityStore(
    entityType
  );
  const { types } = useEntityTypeStore();

  const history = useHistory();

  const isNewEntity = entityId === 'create';

  const entities = useMemo(() => allEntities?.filter(e => e.deleted === showDeletedEntites), [
    allEntities,
    showDeletedEntites,
  ]);

  const newEmptyEntity = useMemo(
    (): ObjectEntity =>
      isNewEntity && user && types
        ? ({
            uid: user.uid,
            name: '',
            description: '',
            type: types.find(type => type.name === entityType),
            properties: {},
            relationshipIds: [],
            deleted: false,
          } as ObjectEntity)
        : undefined,
    [user, entityType, types, isNewEntity]
  );

  // TODO: error component
  if (!entityTypePlural) {
    return <div>Error: entity type was undefined</div>;
  }

  const selectedEntity = entityId && (allEntities?.find(({ id }) => id === entityId) || newEmptyEntity);

  const hasDeletedEntities =
    allEntities && !!(showDeletedEntites ? entities.length : allEntities.length - entities.length);

  const loading = !entities;

  const onSelectEntity = (id: string) => () => {
    history.push(`/${entityTypePlural}/${id}`);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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

  return (
    <React.Fragment>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          flex-grow: 1;
          align-items: flex-start;
        `}
      >
        <Breadcrumbs items={breadcrumbItems} />

        {!selectedEntity && hasDeletedEntities && (
          <Button
            onClick={() => setShowDeletedEntites(!showDeletedEntites)}
            startIcon={showDeletedEntites ? <ArrowBackIcon /> : <DeleteIcon />}
          >
            {showDeletedEntites ? `view ${entityTypePlural}` : `deleted ${entityTypePlural}`}
          </Button>
        )}
      </div>
      {loading && <LoadingIndicator />}

      {selectedEntity && (
        <Fade in={!loading && !!selectedEntity}>
          {<EntityDetailView entity={selectedEntity} onSave={updateCurrentOrSaveNewEntity} key={entityId} />}
        </Fade>
      )}
      {
        <Fade in={!loading && !selectedEntity}>
          <div
            css={css`
              display: grid;
              grid-gap: 30px;
              grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            `}
          >
            {!selectedEntity &&
              entities?.map(entity => (
                <EntityCompactView
                  key={entity.id}
                  onSelect={onSelectEntity(entity.id)}
                  onDelete={() => {
                    if (showDeletedEntites) {
                      reallyDeleteEntity(entity);
                    } else {
                      flagEntityDeleted(entity, true);
                    }
                  }}
                  onRestore={showDeletedEntites ? () => flagEntityDeleted(entity, false) : undefined}
                  entity={entity}
                />
              ))}
            <Fade in={!showDeletedEntites}>
              <div
                css={css`
                  margin-top: 10px;
                  height: 600px;
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
            </Fade>
          </div>
        </Fade>
      }
    </React.Fragment>
  );
};
