
import { Challenge } from '@/hooks/useFinanceData';

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const progress = challenge.type === 'daily' && challenge.id === '1' 
    ? Math.max(0, 100 - (challenge.current / challenge.target) * 100)
    : (challenge.current / challenge.target) * 100;

  return (
    <div className={`rounded-lg p-4 shadow-sm border mb-3 ${
      challenge.completed 
        ? 'bg-savings-light border-savings' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{challenge.badge}</span>
          <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
        </div>
        {challenge.completed && (
          <span className="text-savings text-sm font-medium">Completata! ✅</span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progresso</span>
          <span className="text-progress font-medium">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              challenge.completed ? 'bg-savings' : 'bg-progress'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
