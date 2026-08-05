import React from 'react';
import { Technology } from '../types';

interface TechStackProps {
  technologies: Technology[];
}

export const TechStack: React.FC<TechStackProps> = ({ technologies }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {technologies.map((tech) => {
        if (tech.isDivider) {
          return <div key={tech.name} className="hidden md:block w-full h-0 my-0"></div>;
        }
        return (
          <img
            key={tech.name}
            alt={tech.name}
            src={`/svg/${tech.icon}`}
            className="svg transition-transform hover:scale-110"
            title={tech.name}
          />
        );
      })}
    </div>
  );
};
