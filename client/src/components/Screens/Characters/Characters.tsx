/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';

const Characters: React.FunctionComponent = () => {
  return (
    <div>
      <img
        src="https://images.curiator.com/images/t_x/art/ejecnuuqrgnuzwc6hlvq/andrew-wyeth-airborne-1996.jpg"
        css={css`
          width: 30%;
        `}
      />

      <form>
        <fieldset>
          <label htmlFor="char-name">Name</label>
          <input type="text" name="char-name" id="char-name" placeholder="Enter a name" />
        </fieldset>
        <fieldset>
          <label htmlFor="char-age">Age</label>
          <input type="text" name="char-age" id="char-age" placeholder="Enter character's age" />
        </fieldset>

        <fieldset>
          <label htmlFor="char-gender">Gender</label>
          <select name="char-gender" id="char-gender">
            <option>male</option>
            <option>female</option>
            <option>transgender</option>
            <option>amender</option>
            <option>other</option>
          </select>
        </fieldset>
        <fieldset>
          <label htmlFor="char-description">Character Description</label>
          <input
            type="textarea"
            css={css`
              min-height: 100px;
              height: 200px;
            `}
            name="char-description"
            id="char-description"
          />
        </fieldset>
      </form>
    </div>
  );
};

export default Characters;
