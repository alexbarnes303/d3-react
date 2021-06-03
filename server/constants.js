const _ = require('lodash');

// utility functions
const findMaxValue = (arr) => _.max(arr.map((e) => e.max))
const findMinValue = (arr) => _.min(arr.map((e) => e.min))
const filterElemnts = (elements, filter, value) => {
  return Array.isArray(value) ? elements.filter((d)=> value.includes(d[filter])) 
  : elements.filter((d)=> d[filter] === value)
}

// constants
const MAX_LENGTH = 100;
const DURATION = 500;
const SAMPLE_SIZE = 5;
const MAX_VALUE = 240;
const MIN_VALUE = 20;
const PORT = 8080;

// data structures
const FILTERS = {
  district: { name: 'district', label: 'District' },
  facility: { name:'facility', label: 'Facility' },
  wards: { name: 'wards', label: 'Wards' }
}

// eslint-disable-next-line no-sparse-arrays
const WARDS = [
  {  
    facility:'facility1',
    value: 'all',
    name: FILTERS.wards.name,
    label: 'All',
    max: 320,
    min: 60,
  },
  { 
    facility:'facility1',
    value: 'ward1',
    name: FILTERS.wards.name,
    label: 'Ward 1',
    max: 320,
    min: 80,
  },
  { 
    facility:'facility1',
    value: 'ward2',
    name: FILTERS.wards.name,
    label: 'Ward 2',
    max: 300,
    min: 60,
  },
  {  
    facility:'facility1',
    value: 'ward3',
    name: FILTERS.wards.name,
    label: 'Ward 3',
    max: 320,
    min: 80,
  },
  {  
    facility:'facility2',
    value: 'all',
    name: FILTERS.wards.name,
    label: 'All',
    max: 280,
    min: 30,
  },
  { 
    facility:'facility2',
    value: 'ward4',
    name: FILTERS.wards.name,
    label: 'Ward 4',
    max: 260,
    min: 40,
  },
  { 
    facility:'facility2',
    value: 'ward5',
    name: FILTERS.wards.name,
    label: 'Ward 5',
    max: 260,
    min: 30,
  },
  {  
    facility:'facility2',
    value: 'ward6',
    name: FILTERS.wards.name,
    label: 'Ward 6',
    max: 280,
    min: 40,
  },
  {  
    facility:'facility3',
    value: 'all',
    name: FILTERS.wards.name,
    label: 'All',
    max: 300,
    min: 60,
  },
  { 
    facility:'facility3',
    value: 'ward7',
    name: FILTERS.wards.name,
    label: 'Ward 7',
    max: 280,
    min: 50,
  },
  { 
    facility:'facility3',
    value: 'ward8',
    name: FILTERS.wards.name,
    label: 'Ward 8',
    max: 300,
    min: 60,
  },
  {  
    facility:'facility3',
    value: 'ward9',
    name: FILTERS.wards.name,
    label: 'Ward 9',
    max: 280,
    min: 70,
  },
  {  
    facility:'facility4',
    value: 'all',
    name: FILTERS.wards.name,
    label: 'All',
    max: 220,
    min: 20,
  },
  { 
    facility:'facility4',
    value: 'wardA',
    name: FILTERS.wards.name,
    label: 'Ward A',
    max: 220,
    min: 30,
  },
  { 
    facility:'facility4',
    value: 'wardB',
    name: FILTERS.wards.name,
    label: 'Ward B',
    max: 220,
    min: 30,
  },
  {  
    facility:'facility4',
    value: 'wardB',
    name: FILTERS.wards.name,
    label: 'Ward B',
    max: 220,
    min: 20,
  },
  {  
    facility:'facility5',
    value: 'all',
    name: FILTERS.wards.name,
    label: 'All',
    max: 240,
    min: 50,
  },
  { 
    facility:'facility5',
    value: 'wardC',
    name: FILTERS.wards.name,
    label: 'Ward C',
    max: 240,
    min: 40,
  },
  { 
    facility:'facility5',
    value: 'wardD',
    name: FILTERS.wards.name,
    label: 'Ward D',
    max: 200,
    min: 60,
  },
  {  
    facility:'facility5',
    value: 'wardE',
    name: FILTERS.wards.name,
    label: 'Ward E',
    max: 200,
    min: 60,
  },
  {  
    facility:'facility6',
    value: 'all',
    name: FILTERS.wards.name,
    label: 'All',
    max: 200,
    min: 60,
  },
  { 
    facility:'facility6',
    value: 'wardF',
    name: FILTERS.wards.name,
    label: 'Ward F',
    max: 200,
    min: 60,
  },
  { 
    facility:'facility6',
    value: 'wardG',
    name: FILTERS.wards.name,
    label: 'Ward G',
    max: 180,
    min: 60,
  },
  {  
    facility:'facility6',
    value: 'wardH',
    name: FILTERS.wards.name,
    label: 'Ward H',
    max: 200,
    min: 70,
  },
  {  
    facility:'facility7',
    value: 'all',
    name: FILTERS.wards.name,
    label: 'All',
    max: 180,
    min: 20,
  },
  { 
    facility:'facility7',
    value: 'wardI',
    name: FILTERS.wards.name,
    label: 'Ward I',
    max: 180,
    min: 20,
  },
  { 
    facility:'facility7',
    value: 'wardJ',
    name: FILTERS.wards.name,
    label: 'Ward J',
    max: 180,
    min: 30,
  },
  {  
    facility:'facility7',
    value: 'wardK',
    name: FILTERS.wards.name,
    label: 'Ward K',
    max: 140,
    min: 20,
  },
  {  
    facility:'facility8',
    value: 'all',
    name: FILTERS.wards.name,
    label: 'All',
    max: 140,
    min: 20,
  },
  { 
    facility:'facility8',
    value: 'wardL',
    name: FILTERS.wards.name,
    label: 'Ward L',
    max: 140,
    min: 30,
  },
  { 
    facility:'facility8',
    value: 'wardM',
    name: FILTERS.wards.name,
    label: 'Ward M',
    max: 120,
    min: 20,
  },
  {  
    facility:'facility8',
    value: 'wardN',
    name: FILTERS.wards.name,
    label: 'Ward N',
    max: 140,
    min: 20,
  },
  {  
    facility:'facility9',
    value: 'all',
    name: FILTERS.wards.name,
    label: 'All',
    max: 120,
    min: 20,
  },
  { 
    facility:'facility9',
    value: 'wardO',
    name: FILTERS.wards.name,
    label: 'Ward O',
    max: 100,
    min: 20,
  },
  { 
    facility:'facility9',
    value: 'wardP',
    name: FILTERS.wards.name,
    label: 'Ward P',
    max: 110,
    min: 20,
  },
  {  
    facility:'facility9',
    value: 'wardQ',
    name: FILTERS.wards.name,
    label: 'Ward Q',
    max: 120,
    min: 30,
  },
];

const FACILITIES = [
  { 
    district: 'district1',
    value: 'all',
    name: FILTERS.facility.name,
    label: 'All',
    max: findMaxValue(filterElemnts(WARDS, FILTERS.facility.name, ['facility1','facility2', 'facility3'])),
    min: findMinValue(filterElemnts(WARDS, FILTERS.facility.name, ['facility1',' facility2', 'facility3'])),
  },
  { 
    district: 'district1',
    value: 'facility1',
    name: FILTERS.facility.name,
    label: 'Facility 1',
    max: findMaxValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility1')),
    min: findMinValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility1')),
  },
  {  
    district: 'district1',
    value: 'facility2',
    name: FILTERS.facility.name,
    label: 'Facility 2',
    max: findMaxValue(filterElemnts(WARDS, FILTERS.facility.name,'facility2')),
    min: findMinValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility2')),
  },
  {  
    district: 'district1',
    value: 'facility3',
    name: FILTERS.facility.name,
    label: 'Facility 3',
    max: findMaxValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility3')),
    min: findMinValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility3')),
  },
  { 
    district: 'district2',
    value: 'all',
    name: FILTERS.facility.name,
    label: 'All',
    max: findMaxValue(filterElemnts(WARDS, FILTERS.facility.name, ['facility4','facility5', 'facility6'])),
    min: findMinValue(filterElemnts(WARDS, FILTERS.facility.name, ['facility4','facility5', 'facility6'])),
  },
  { 
    district: 'district2',
    value: 'facility4',
    name: FILTERS.facility.name,
    label: 'Facility 4',
    max: findMaxValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility4')),
    min: findMinValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility4')),
  },
  {  
    district: 'district2',
    value: 'facility5',
    name: FILTERS.facility.name,
    label: 'Facility 5',
    max: findMaxValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility5')),
    min: findMinValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility5')),
  },
  {  
    district: 'district2',
    value: 'facility6',
    name: FILTERS.facility.name,
    label: 'Facility 6',
    max: findMaxValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility6')),
    min: findMinValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility6')),
  }, 
  { 
    district: 'district3',
    value: 'all',
    name: FILTERS.facility.name,
    label: 'All',
    max: findMaxValue(filterElemnts(WARDS, FILTERS.facility.name, ['facility7', 'facility8', 'facility9'])),
    min: findMinValue(filterElemnts(WARDS,FILTERS.facility.name, ['facility7', 'facility8', 'facility9'])),
  },
  { 
    district: 'district3',
    value: 'facility7',
    name: FILTERS.facility.name,
    label: 'Facility 7',
    max: findMaxValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility7')),
    min: findMinValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility7')),
  },
  {  
    district: 'district3',
    value: 'facility8',
    name: FILTERS.facility.name,
    label: 'Facility 8',
    max: findMaxValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility8')),
    min: findMinValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility8')),
  },
  {  
    district: 'district3',
    value: 'facility9',
    name: FILTERS.facility.name,
    label: 'Facility 9', 
    max: findMaxValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility9')),
    min: findMinValue(filterElemnts(WARDS, FILTERS.facility.name, 'facility9')),
  }
];

const DISTRICTS = [
  { 
    group: 'fields',
    value: 'all',
    name: FILTERS.district.name,
    label: 'All',
    max: findMaxValue(filterElemnts(FACILITIES, FILTERS.district.name, ['district1', 'district2','district3'])),
    min: findMinValue(filterElemnts(FACILITIES, FILTERS.district.name, ['district1', 'district2','district3'])),
  },
  { 
    group: 'fields',
    value: 'district1',
    name: FILTERS.district.name,
    label: 'District 1',
    max: findMaxValue(filterElemnts(FACILITIES, FILTERS.district.name, 'district1')),
    min: findMinValue(filterElemnts(FACILITIES, FILTERS.district.name, 'district1')),
  },
  {
    group: 'fields',
    value: 'district2',
    name: FILTERS.district.name,
    label: 'District 2',
    max: findMaxValue(filterElemnts(FACILITIES, FILTERS.district.name, 'district2')),
    min: findMinValue(filterElemnts(FACILITIES, FILTERS.district.name, 'district2')),
  },
  { 
    group: 'fields',
    value: 'district3',
    name: FILTERS.district.name,
    label: 'District 3',
    max: findMaxValue(filterElemnts(FACILITIES, FILTERS.district.name, 'district3')),
    min: findMinValue(filterElemnts(FACILITIES, FILTERS.district.name, 'district3')),
  }
];

const OPTIONS = [
  { 
    name: FILTERS.district.name,
    label: FILTERS.district.label,
    fields: DISTRICTS,
  },
  { 
    name: FILTERS.facility.name,
    label: FILTERS.facility.label,
    fields: FACILITIES,
  },
  { 
    name: FILTERS.wards.name,
    label: FILTERS.wards.label,
    fields: WARDS,
  }
];

// exported constants
module.exports = {
  OPTIONS,
  FILTERS,
  MAX_LENGTH,
  DURATION,
  SAMPLE_SIZE,
  MIN_VALUE,
  MAX_VALUE,
  PORT,
};