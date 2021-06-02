import React from 'react';
import { Formik, Field } from 'formik';
import { FormControlLabel, FormLabel, Radio } from '@material-ui/core'
import { INITIAL_VALUES } from './constants';
import { RadioGroup } from 'formik-material-ui';
import styled from 'styled-components';

// styled components
const Column = styled.div`
  width: 33%;
  justify-content: center;
  display: flex;
  align-items: top;
  margins: auto;
`;

const RadioPanels = ({ selection, options, handleChange }) => {
  return (
    <Formik
       initialValues={INITIAL_VALUES}
       onSubmit={(values) => {}}
    >
      {
        ({ isSubmitting }) => {
          return options.map((o, i) => ( 
            <Column style={{ alignContent: 'center'}} key={i}>
              <Field  onChange={handleChange} component={RadioGroup} name={o.name} value={selection[o.name]} type={'checkbox'}>
                <FormLabel style={{textAlign: 'center', fontWeight: 'bold'}}>{o.label}</FormLabel>
                  {  
                    o.fields.filter((f) => (f.name && f.name === 'district') || 
                      (f.name === 'facility' && f.district && f.district === selection.district) ||
                      (f.name === 'wards' && f.facility && f.facility === selection.facility)
                    ).map((f, i) => {
                      return (
                        <FormControlLabel
                          key={i}
                          control={<Radio disabled={isSubmitting} />}
                          name={f.name}
                          value={f.value}
                          label={f.label}
                        />                             
                      ) 
                    })
                  }
              </Field> 
          </Column>
         ))
      }}  
    </Formik> 
  )
};

export default RadioPanels