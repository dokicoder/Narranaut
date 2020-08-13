/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx, InterpolationWithTheme } from '@emotion/core';
import { ObjectEntity } from '../../models';
import { Icons, onChangeWrapper } from '../../utils';

interface Props {
  entity: ObjectEntity;
  cCss?: InterpolationWithTheme<any>;
  onSave?: (updatedEntity: ObjectEntity) => void;
  onDiscard?: () => void;
}

export const EntityDetailView: React.FC<Props> = props => {
  const { cCss, entity, onSave, onDiscard } = props;
  const { id, image, properties, type, tags } = entity;

  const [description, updateDescription] = useState(entity.description);
  const [name, updateName] = useState(entity.name);

  const updatedEntity = (): ObjectEntity => ({
    ...entity,
    name,
    description,
  });

  return (
    <div
      className="card"
      css={
        [
          css`
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.12);
            display: flex;
            flex-direction: column;
            padding: 35px;

            header,
            footer {
              padding: 0 !important;
            }

            header {
              padding-bottom: 20px !important;
              cursor: pointer;
            }

            footer {
              padding-top: 20px !important;
            }

            textarea {
              resize: vertical;
            }
          `,
          cCss,
        ] as InterpolationWithTheme<string>
      }
    >
      <header>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            align-items: flex-start;
          `}
        >
          <input
            type="text"
            name="entity-name"
            id="entity-name"
            placeholder="Enter a name"
            value={name}
            onChange={onChangeWrapper(updateName)}
          />
          <div
            css={css`
              background-color: ${type.color || '#eeeeee'};
              border-radius: 5px;
              padding: 7px;
              font-size: 12px;
            `}
          >
            {type.icon ? (
              <img
                css={css`
                  width: 28px;
                  height: 28px;
                  display: block;
                  margin: auto;
                `}
                src={Icons[type.icon]}
              />
            ) : null}
            <div>{type.name}</div>
          </div>
        </div>
        <div>
          {tags?.map(tag => (
            <span
              key={`${id}-tag-${tag}`}
              className="label success"
              css={css`
                border-radius: 10px;
                padding-left: 10px;
                padding-right: 10px;
                margin-top: 20px;

                :first-of-type {
                  margin-left: 0;
                }
              `}
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <footer
        css={css`
          overflow-y: auto;
          font-size: 14px;
          scrollbar-width: thin;

          ::-webkit-scrollbar {
            width: 7px;
          }

          scrollbar-width: thin;
          scrollbar-color: #bbbbdd transparent;

          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #bbbbbb;
            border-radius: 6px;
            border: 3px solid transparent;
          }
        `}
      >
        <textarea
          name="entity-description"
          id="entity-description"
          placeholder="Enter a name"
          value={description}
          onChange={onChangeWrapper(updateDescription)}
        />
        {image ? (
          <img
            src={image}
            css={css`
              width: 30%;
            `}
          />
        ) : null}
        {Object.entries(properties).map(([name, value], idx) => (
          <fieldset key={idx}>
            <label htmlFor={`entity-prop-${name}`}>{name}</label>
            <input
              type="text"
              name={`entity-prop-${name}`}
              id={`entity-prop-${name}`}
              placeholder={`Enter a value for ${name}`}
              value={value}
            />
          </fieldset>
        ))}
        <div
          css={css`
            margin-top: 20px;
            button {
              margin-right: 10px;
            }
          `}
        >
          <button onClick={() => onSave(updatedEntity())}>Save</button>
          <button onClick={onDiscard} className="pseudo">
            Discard
          </button>
        </div>
      </footer>
    </div>
  );
};
