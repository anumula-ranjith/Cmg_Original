import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';
import React from 'react';

import PageLoader, { Loading } from './Loader';

describe('PageLoader Component', () => {
  it('should render CircularProgress and Loading text', () => {
    render(<PageLoader />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    const circularProgress = screen.getByRole('progressbar');
    expect(circularProgress).toBeInTheDocument();
  });
});

describe('Loading Component', () => {
  it('should render CircularProgress', () => {
    render(<Loading />);
    const circularProgress = screen.getByRole('progressbar');
    expect(circularProgress).toBeInTheDocument();
  });
});
