/** @jsx jsx */
import React from 'react';
import { css, jsx, InterpolationWithTheme } from '@emotion/core';
import { ObjectEntity } from '../../models';
import { Icons } from '../../utils';

interface Props extends ObjectEntity {
  cCss?: InterpolationWithTheme<any>;
}

export const EntityView: React.FC<Props> = ({ cCss, id, image, properties, name, description, type, tags }) => {
  return (
    <div
      className="card"
      css={
        [
          css`
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.12);
            height: 300px;
            display: flex;
            flex-direction: column;
            padding: 14px;
          `,
          cCss,
        ] as InterpolationWithTheme<string>
      }
    >
      <header>
        <h1
          css={css`
            margin: 0;
            padding: 26px 0 !important;
            line-height: 1;
            font-size: 36px;
          `}
        >
          {name}
        </h1>
        <div
          css={css`
            display: inline-block;
            background-color: ${type.color || '#eeeeee'};
            border-radius: 5px;
            padding: 7px;
            font-size: 10px;
            position: absolute;
            right: 10px;
            top: 10px;
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
        <div>
          {tags.map(tag => (
            <span
              key={`${id}-tag-${tag}`}
              className="label success"
              css={css`
                border-radius: 10px;
                padding-left: 10px;
                padding-right: 10px;

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

        <form>
          {Object.values(properties).map(({ name, value }, idx) => (
            <fieldset key={idx}>
              <label htmlFor="char-name">{name}</label>
              <input
                type="text"
                name="char-name"
                id="char-name"
                placeholder={`Enter a value for {name}`}
                value={value}
              />
            </fieldset>
          ))}
        </form>
      </footer>
    </div>
  );
};
