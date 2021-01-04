import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import App from '../components/App';
import { headData } from '../mock/data';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/main.scss';

const Index = ({ pageContext: { advertisments } }) => {
  const { title, lang, description } = headData;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title || 'Cap Sizun'}</title>
        <html lang={lang || 'fr'} />
        <meta
          name="description"
          content={description || 'Les dernières annonces immobilières du Cap Sizun'}
        />
      </Helmet>
      <App advertisments={advertisments} />
    </>
  );
};

Index.propTypes = {
  pageContext: PropTypes.shape(),
};

export default Index;
