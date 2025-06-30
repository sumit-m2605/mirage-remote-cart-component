import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';
import RemoteReactComponent from './components/RemoteReactComponent';

const WebComponent = reactToWebComponent(RemoteReactComponent, React, ReactDOM);
customElements.define('react-remote-box', WebComponent);

export default {};
