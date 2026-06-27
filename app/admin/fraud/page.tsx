import { getFraudAlerts } from '@/lib/actions/scan-actions';
import { FraudAlertsPanel } from '@/components/admin/fraud-alerts-panel';

export default async function FraudDetectionPage() {
  const alerts = await getFraudAlerts();
  return <FraudAlertsPanel initialAlerts={alerts} />;
}
