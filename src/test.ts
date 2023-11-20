import axios from 'axios';
import {GET_TOKEN} from './query/queries/urls';

axios
  .get(`${GET_TOKEN}/JpVqKAcILJS7ai3utZZYQK0vyzMcuCCJFf8rh8WtCinJXgAAAYpPT54G`)
  .then(res => {
    console.log('getDoobiToken: ', res?.data);
  })
  .catch(e => {
    console.log('getDoobiToken: ', e);
  });
