import React from 'react';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { Article, State } from '../types';
import { deleteArticle } from '../actions';

const mapStateToProps = (state: State) => {
  return { articles: state.articles };
};

function mapDispatchToProps(dispatch: (a: Action) => void) {
  return {
    deleteArticle: (articleId: number) => dispatch(deleteArticle(articleId))
  };
}

interface Props {
  articles: Article[];
  deleteArticle: (articleId: number) => void;
}

const ArticleList: React.SFC<Props> = ({ articles, deleteArticle }) => (
  <ul>
    {articles.map(el => (
      <li key={el.id}>
        {el.title}
        <a onClick={() => deleteArticle(el.id)}>Delete</a>
      </li>
    ))}
  </ul>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleList);
