/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';
import { EntityCompactView, EntityDetailView } from '../../EntityView';
import { LoadingIndicator } from 'src/components/LoadingIndicator';
import { useEntityStore } from 'src/hooks';
import { useParams, useHistory } from 'react-router-dom';
import { Breadcrumbs } from 'src/components';

const Characters: React.FC = () => {
  const { entities, updateEntity } = useEntityStore('character');

  const loading = !entities;

  const { entityId } = useParams<{ entityId: string }>();

  const history = useHistory();

  const selectedEntity = entityId && entities?.find(({ id }) => id === entityId);

  const onSelectEntity = (id: string) => () => {
    history.push(`/characters/${id}`);
  };

  const onViewEntityList = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    history.push(`/characters`);
  };

  const breadcrumbItems: any = [{ label: 'Characters', handler: onViewEntityList, active: !selectedEntity }];

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

export default Characters;
