/** @jsx jsx */
import React from 'react';
import { css, jsx, InterpolationWithTheme } from '@emotion/core';
import { ObjectEntity } from '../../models';
import { Icons } from '../../utils';

interface Props {
  entity: ObjectEntity;
  cCss?: InterpolationWithTheme<any>;
  onSelect?: () => void;
}

export const EntityCompactView: React.FC<Props> = ({ cCss, onSelect, entity }) => {
  const { id, image, properties, name, description, type, tags } = entity;

  return (
    <div
      className="card"
      css={
        [
          css`
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.12);
            height: 350px;
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

            table {
              margin-top: 10px;
              width: 100%;
            }
          `,
          cCss,
        ] as InterpolationWithTheme<string>
      }
    >
      <header onClick={onSelect}>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            align-items: flex-start;
          `}
        >
          <h1
            css={css`
              margin: 0;
              line-height: 1;
              font-size: 23px;
              flex-grow: 1;
              min-width: 0;
            `}
          >
            {name}
          </h1>
          <div
            css={css`
              background-color: ${type.color || '#eeeeee'};
              border-radius: 5px;
              padding: 7px;
              font-size: 10px;
              margin: 0 !important;
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
        {description}
        {image ? (
          <img
            src={image}
            css={css`
              width: 30%;
            `}
          />
        ) : null}

        <table className="primary">
          <tbody>
            {Object.entries(properties).map(([name, value]) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </footer>
    </div>
  );
};
