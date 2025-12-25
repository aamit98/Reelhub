// This route redirects to the main search page
import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';

const SearchQuery = () => {
  const { query } = useLocalSearchParams();
  return <Redirect href={{ pathname: '/search', params: { query: query || '' } }} />;
};

export default SearchQuery;