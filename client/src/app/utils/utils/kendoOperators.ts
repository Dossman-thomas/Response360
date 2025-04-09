// kendoOperators.ts
interface FilterOperatorDescriptor {
  text: string;
  value: string;
}

// String-based operators for fields like name, email, etc.
export const stringOperators: FilterOperatorDescriptor[] = [
  { text: 'Contains', value: 'contains' },
  { text: 'Does not contain', value: 'doesnotcontain' },
  { text: 'Equals', value: 'eq' },
  { text: 'Not equal', value: 'neq' },
  { text: 'Starts with', value: 'startswith' },
  { text: 'Ends with', value: 'endswith' },
];

// Boolean operators
export const booleanOperators: FilterOperatorDescriptor[] = [
  { text: 'Is True', value: 'eq' },
  { text: 'Is False', value: 'neq' },
];

  
  // Date field operators
  // export const dateOperators = [
  //   { text: 'Is after', value: 'gt' },
  //   { text: 'Is before', value: 'lt' },
  //   { text: 'Is equal to', value: 'eq' }
  // ];
  
  // // Number field operators (if needed)
  // export const numberOperators = [
  //   { text: 'Equals', value: 'eq' },
  //   { text: 'Not equal to', value: 'neq' },
  //   { text: 'Greater than', value: 'gt' },
  //   { text: 'Less than', value: 'lt' },
  // ];
  