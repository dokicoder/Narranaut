/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';

const Characters: React.FunctionComponent = () => {
  return (
    <Row>
      <Col md={4}>
        <img
          src="https://images.curiator.com/images/t_x/art/ejecnuuqrgnuzwc6hlvq/andrew-wyeth-airborne-1996.jpg"
          css={css`
            width: 100%;
          `}
        />
      </Col>
      <Col md={8}>
        <Form>
          <FormGroup>
            <Label for="char-name">Name</Label>
            <Input type="text" name="char-name" id="char-name" placeholder="Enter a name" />
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="char-age">Age</Label>
                <Input type="number" name="char-age" id="char-age" placeholder="Enter character's age" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="char-gender">Gender</Label>
                <Input type="select" name="char-gender" id="char-gender">
                  <option>male</option>
                  <option>female</option>
                  <option>transgender</option>
                  <option>agender</option>
                  <option>other</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label for="char-description">Character Description</Label>
            <Input
              type="textarea"
              css={css`
                min-height: 100px;
                height: 200px;
              `}
              name="char-description"
              id="char-description"
            />
          </FormGroup>
        </Form>
      </Col>
    </Row>
  );
};

export default Characters;
