// Setup file for vitest + @testing-library/react
import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Ensure DOM is cleaned between tests
afterEach(() => {
  cleanup();
});
