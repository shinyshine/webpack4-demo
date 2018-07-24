import React from 'react';
import { render } from 'react-dom';

import Article from './components/article';
import './index.scss';
import './demo';

render(<Article title="article" />, document.querySelector('#app'));
