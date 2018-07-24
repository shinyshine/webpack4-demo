import React from 'react';
import PropTypes from 'prop-types';
import Cards from '../cards/Cards';
import styles from './Article.scss';

const App = ({ title }) => (
    <div className={styles.container}>
        <h1>{title}~{title}</h1>
        <Cards />
    </div>
);

App.propTypes = {
    title: PropTypes.string.isRequired
};

export default App;
