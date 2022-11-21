import { useTabRoutes } from '@hooks/useTabRoutes';
import { selectHomeIcon, selectTabWhitelist } from '@redux/selector';
import { renderHook } from '@testing-library/react-hooks';
import { mockImport } from '@utils/testing/mockImport';

jest.mock('react-redux', () => ({
  __esmodule: true,
  useSelector: (cb: () => any) => cb(),
}));

jest.mock('@redux/selector');
const mockSelectHomeIcon = mockImport(selectHomeIcon);
const mockSelectTabWhitelist = mockImport(selectTabWhitelist);

it('should only show items that are in the whitelist', () => {
  mockSelectTabWhitelist.mockReturnValue(['/', '/account']);
  const { result } = renderHook(() => useTabRoutes());
  expect(result.current).toHaveLength(2);
});

// it('should override homeIcon if defined', () => {
//   mockSelectTabWhitelist.mockReturnValue(['/']);
//   mockSelectHomeIcon.mockReturnValue('image.png');
//   const { result } = renderHook(() => useTabRoutes());
//   expect(result.current[0].icon).toEqual('image.png');
// });
