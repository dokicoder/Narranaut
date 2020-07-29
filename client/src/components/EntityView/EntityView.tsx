/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { ObjectEntity } from '../../models';
import { Icons } from '../../utils';

interface Props extends ObjectEntity {}

export const EntityView: React.FC<Props> = ({ id, image, properties, name, description, type, tags }) => {
  return (
    <div
      className="card"
      css={css`
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.12);
        max-width: 500px;
      `}
    >
      <header>
        <h1
          css={css`
            margin: 0;
            padding: 0;
            line-height: 1;
            font-size: 50px;
          `}
        >
          {name}
        </h1>
        <div
          css={css`
            display: inline-block;
            background-color: #eeeeee;
            border-radius: 5px;
            padding: 10px;
            font-size: 12px;
          `}
        >
          {type.icon ? (
            <img
              css={css`
                width: 32px;
                height: 32px;
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

      <footer>
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
