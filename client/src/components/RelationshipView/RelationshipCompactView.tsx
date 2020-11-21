/** @jsx jsx */
import React from 'react';
import produce from 'immer';
import { useHistory } from 'react-router-dom';
import { css, SerializedStyles } from '@emotion/core';
import { Avatar, Paper, Select } from '@material-ui/core';
import { jsx } from '@emotion/core';
import { onChangeWrapper } from 'src/utils/form';
import { useRelationshipStore } from 'src/hooks/relationshipStore';
import { useImageUrl } from 'src/hooks';
import { Icon, Icons } from 'src/utils';
import { ObjectEntity, Relationship } from 'src/models';
import { pluralize } from 'src/utils';
import { FormControl } from '@material-ui/core';
import { MenuItem } from '@material-ui/core';
import { useRelationshipTypeStore } from 'src/hooks';
import { MainTheme } from 'src/utils/themes';

interface Props {
  relationship: Relationship;
  displayingEntityId?: string;
  // flag the view as editable (extended UI) by providing this callback
  onUpdate?: (updated: Relationship) => void;
  cCss?: SerializedStyles;
}

const emphasize = (text: string) => {
  return `<span style="font-weight: bold; color: ${MainTheme.palette.primary.main}">${text}</span>`;
};

export const RelationshipCompactView: React.FC<Props> = ({ relationship, displayingEntityId, cCss, onUpdate }) => {
  const { typeId, party1, party2 } = relationship;

  const { typesMap, types } = useRelationshipTypeStore();

  const history = useHistory();

  const { imageUrl: party1imageUrl } = useImageUrl(party1.id);
  const { imageUrl: party2imageUrl } = useImageUrl(party2.id);

  const onSelectEntity = (entity: ObjectEntity) => () => {
    const entityTypePlural = pluralize(entity.type.name);

    history.push(`/${entityTypePlural}/${entity.id}`);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // TODO: does this obfuscate errors? (I think so...)
  if (!typesMap?.[typeId] || !party1 || !party2) {
    console.log(!!typesMap?.[typeId], !!party1, !party2);
    return <div>No can do {JSON.stringify(relationship, null, 2)}</div>;
  }

  // these expressions need to also work for displayingEntity === undefined
  const leftParty = displayingEntityId === party2.id ? party2 : party1;
  const rightParty = displayingEntityId === party2.id ? party1 : party2;
  const leftPartyImageUrl = displayingEntityId === party2.id ? party2imageUrl : party1imageUrl;
  const rightPartyImageUrl = displayingEntityId === party2.id ? party1imageUrl : party2imageUrl;

  const editMode = !!onUpdate;

  const { forwardName, backwardName, icon } = typesMap[typeId];

  const relationshipDirection = !backwardName ? 'symmetric' : displayingEntityId === party2.id ? 'backward' : 'forward';

  const placeholderLabel = (displayingEntityId === party2.id && backwardName) || forwardName;

  const label =
    leftParty.name &&
    rightParty.name &&
    placeholderLabel.replace('{{p1}}', emphasize(leftParty.name)).replace('{{p2}}', emphasize(rightParty.name));

  const iconSrc = Icons[icon as Icon];

  return (
    <Paper
      css={[
        css`
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          flex-wrap: wrap;
        `,
        cCss,
      ]}
    >
      <div
        css={css`
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 10px;
        `}
      >
        <Avatar
          css={css`
            width: 120px;
            height: 120px;
            cursor: pointer;
          `}
          alt={leftParty.name}
          src={leftPartyImageUrl}
          onClick={onSelectEntity(leftParty)}
        />
        <div
          css={css`
            position: relative;
          `}
        >
          {editMode ? (
            <FormControl variant="outlined">
              <Select
                css={css`
                  width: 60px;
                  height: 60px;
                  margin: 10px;

                  color: transparent;
                  overflow: hidden;

                  div > img {
                    position: absolute;

                    width: 30px;
                    height: 30px;
                    transform: translate(-50%, -50%);
                    top: 50%;
                    left: 50%;
                  }

                  svg.MuiSvgIcon-root.MuiSelect-icon {
                    left: 50% !important;
                    transform: translateX(-50%);
                    top: auto !important;
                    bottom: 0 !important;
                  }
                `}
                value={typeId}
                onChange={
                  onUpdate &&
                  onChangeWrapper(newTypeid =>
                    onUpdate(
                      produce(relationship, r => {
                        r.typeId = newTypeid;
                      })
                    )
                  )
                }
              >
                {types?.map(type => {
                  const iconSrc = Icons[type.icon as Icon];

                  return (
                    <MenuItem
                      css={css`
                        padding-left: 45px;

                        img {
                          position: absolute;
                          margin-left: -5px;
                          height: 30px;
                          transform: translateX(-100%);
                        }
                      `}
                      key={type.id}
                      value={type.id}
                    >
                      {type.name}
                      {iconSrc && <img src={iconSrc} />}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          ) : (
            <img
              css={css`
                width: 30px;
                height: 30px;
                margin: 25px;
              `}
              src={iconSrc}
            />
          )}
          <button
            css={css`
              position: absolute;
              transform: translate(-50%, 100%);
              left: 50%;
              bottom: 8px;
              padding: 0 5px;
              border: none;
              background-color: transparent;

              :disabled {
                color: initial;
              }

              :active,
              :focus {
                outline: none;
              }

              :hover {
                background-color: #00000020;
              }
            `}
            disabled={relationshipDirection === 'symmetric'}
            onClick={() => onUpdate({ ...relationship, party1: relationship.party2, party2: relationship.party1 })}
          >
            <h2
              css={css`
                margin: 0;
              `}
            >
              {
                {
                  symmetric: '⇔',
                  forward: '⇒',
                  backward: '⇐',
                }[relationshipDirection]
              }
            </h2>
          </button>
        </div>
        <Avatar
          css={css`
            width: 120px;
            height: 120px;
            cursor: pointer;
          `}
          alt={rightParty.name}
          src={rightPartyImageUrl}
          onClick={onSelectEntity(rightParty)}
        />
      </div>
      {/* TODO: this adds unnormalized form content to the DOM :( - it's called dangerouslySetInnerHTML for a reason */}
      {label && <span dangerouslySetInnerHTML={{ __html: label }} />}
    </Paper>
  );
};

interface ByIdProps extends Omit<Props, 'relationship'> {
  relationshipId: string;
}

export const RelationshipCompactViewById: React.FC<ByIdProps> = ({ relationshipId, ...props }) => {
  const { relationshipMap } = useRelationshipStore();
  const relationship = relationshipMap[relationshipId];

  return relationship ? <RelationshipCompactView {...props} relationship={relationship} /> : null;
};
