import { useSelector } from 'react-redux';
import ProviderTabs from './ProviderTabNavigator';
import ConsumerTabs from './ConsumerTabNavigator';

export default function DashboardRouter() {
  const role = useSelector(state => state.profile.user?.role);
   console.log('role in dashboard router',role);
   
  if (role === 'provider') return <ProviderTabs />;
  if (role === 'consumer') return <ConsumerTabs />;
  return null; // Or loading
}
