import '@testing-library/jest-dom/extend-expect';

import { render, screen } from '@testing-library/react';
import type { GraphQLSchema } from 'graphql';
import React from 'react';

import * as UseSchemaModule from '../../client/graphql/instrospection/useSchema';
import Taskpane from './Taskpane';

jest.mock('../../client/graphql/instrospection/useSchema');
jest.mock('./TableScreen', () => () => <div data-testid="table-screen" />);
jest.mock('./AuthenticateScreen', () => () => <div data-testid="authenticate-screen" />);
jest.mock('./loader/Loader', () => () => <div data-testid="page-loader" />);

describe('Taskpane Component', () => {
  let useSchemaSpy: jest.SpyInstance<ReturnType<typeof UseSchemaModule.useSchema>>;

  beforeEach(() => {
    useSchemaSpy = jest.spyOn(UseSchemaModule, 'useSchema');
  });

  it('should render PageLoader when loading', () => {
    useSchemaSpy.mockReturnValue({ loading: true, schema: null, error: null });
    render(<Taskpane />);
    expect(screen.getByTestId('page-loader')).toBeInTheDocument();
  });

  it('should render TableScreen when schema is present', () => {
    useSchemaSpy.mockReturnValue({ loading: false, schema: {} as GraphQLSchema, error: null });
    render(<Taskpane />);
    expect(screen.getByTestId('table-screen')).toBeInTheDocument();
    expect(screen.queryByTestId('authenticate-screen')).not.toBeInTheDocument();
  });

  it('should render AuthenticateScreen when schema is not present', () => {
    useSchemaSpy.mockReturnValue({ loading: false, schema: null, error: null });
    render(<Taskpane />);
    expect(screen.getByTestId('authenticate-screen')).toBeInTheDocument();
    expect(screen.queryByTestId('table-screen')).not.toBeInTheDocument();
  });
});
