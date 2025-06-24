
import { SavingsGoal } from '@/hooks/useFinanceData';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
}

const SavingsGoalCard = ({ goal }: SavingsGoalCardProps) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const daysLeft = Math.ceil(
    (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
        <span className="text-sm text-gray-500">{goal.category}</span>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-savings font-medium">€{goal.currentAmount.toFixed(2)}</span>
          <span className="text-gray-600">€{goal.targetAmount.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-savings h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-progress font-medium">{progress.toFixed(1)}% completato</span>
        <span className="text-gray-600">
          {daysLeft > 0 ? `${daysLeft} giorni rimasti` : 'Scaduto'}
        </span>
      </div>
    </div>
  );
};

export default SavingsGoalCard;
