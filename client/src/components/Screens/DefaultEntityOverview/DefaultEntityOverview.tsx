/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import { EntityCompactView, EntityDetailView } from '../../EntityView';
import { LoadingIndicator } from 'src/components/LoadingIndicator';
import { useEntityStore } from 'src/hooks';
import { useParams, useHistory } from 'react-router-dom';
import { Breadcrumbs } from 'src/components';
import { singularize } from 'src/utils';

export const DefaultEntityOverview: React.FC = () => {
  const { entityType: entityTypePlural, entityId } = useParams<{ entityType: string; entityId: string }>();
  const entityType = singularize(entityTypePlural);
  const { entities, updateEntity } = useEntityStore(entityType);

  const history = useHistory();

  // TODO: error component
  if (!entityTypePlural) {
    return <div>Error: entity type was undefined</div>;
  }

  const selectedEntity = entityId && entities?.find(({ id }) => id === entityId);

  const loading = !entities;

  const onSelectEntity = (id: string) => () => {
    history.push(`/${entityTypePlural}/${id}`);
  };

  const onViewEntityList = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    history.push(`/${entityTypePlural}`);
  };

  const breadcrumbItems: any = [{ label: `${entityTypePlural}`, handler: onViewEntityList, active: !selectedEntity }];

  if (selectedEntity) {
    breadcrumbItems.push({ label: selectedEntity.name, active: true });
  }

  return loading ? (
    <LoadingIndicator />
  ) : (
    <React.Fragment>
      <Breadcrumbs items={breadcrumbItems} />
      {selectedEntity ? (
        <EntityDetailView entity={selectedEntity} onSave={updateEntity} />
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
        </div>
      )}
    </React.Fragment>
  );
};
