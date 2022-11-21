import { renderHook, act } from '@testing-library/react-hooks';
import { useLocationStateData } from '../useLocationStateData';

jest.mock('react-router-dom', () => ({
  __esmodule: true,
  useLocation: () => ({
    state: {
      data: 1,
    },
  }),
}));

describe('useLocationStateData', () => {
  it('match result', () => {
    const { result } = renderHook(() => useLocationStateData<number>());

    expect(result.current).toEqual(1);
  });
});
