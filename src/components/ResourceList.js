import React from 'react';
import { mockResources } from '../mockData';

const ResourceList = ({ limit }) => {
  const resources = limit ? mockResources.slice(0, limit) : mockResources;

  return (
    <div className="resource-list">
      {resources.map((resource) => (
        <div key={resource.id} className="resource-item">
          <h3>{resource.title}</h3>
          <p>Category: {resource.category}</p>
        </div>
      ))}
    </div>
  );
};

export default ResourceList;