import { RouterProvider } from '@tanstack/react-router';
import { router } from './router/Router';

export type { TimerSnapshot } from './router/Router';

const App = () => <RouterProvider router={router} />;

export default App;
