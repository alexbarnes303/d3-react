import RadioPanels from './RadioPanels';
import React from 'react';
import styled from 'styled-components';

// styled components
const Container = styled.div`
  margin: auto;;
  border: 1px solid black;
  width: 1160px;
  height: 200px;
  display: flex;
  justify-content: space-around;
  padding: 10px;
`;

const FilterPanel = (props) => {
   return (
      <Container>
        <RadioPanels {...props} />
      </Container>
   )
};

export default FilterPanel;