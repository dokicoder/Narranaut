// src/js/components/Form.jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addArticle } from '../actions';
import { Article } from '../types';
import { Action } from 'redux';

let idInc = 1;

function mapDispatchToProps(dispatch: (a: Action) => void) {
  return {
    addArticle: (article: Article) => dispatch(addArticle(article))
  };
}

interface Props {
  addArticle: (a: Article) => void;
}

interface State {
  title: string;
}

class Form extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      title: ''
    };
  }

  handleChange = (event: any) => {
    this.setState({ [event.target.id]: event.target.value } as any);
  };
  handleSubmit = (event: any) => {
    event.preventDefault();
    const { title } = this.state;
    this.props.addArticle({ title, id: idInc++ });
    this.setState({ title: '' });
  };

  render() {
    const { title } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit" className="btn btn-success btn-lg">
          SAVE
        </button>
      </form>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Form);
