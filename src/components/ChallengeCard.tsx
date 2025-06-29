import { Challenge } from '@/hooks/useFinanceData';

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const progress = challenge.type === 'daily' && challenge.id.includes('daily') 
    ? Math.max(0, 100 - (challenge.current / challenge.target) * 100)
    : (challenge.current / challenge.target) * 100;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'spending': return 'bg-expense text-white';
      case 'saving': return 'bg-savings text-white';
      case 'investment': return 'bg-blue-500 text-white';
      case 'education': return 'bg-progress text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'spending': return 'Spese';
      case 'saving': return 'Risparmio';
      case 'investment': return 'Investimenti';
      case 'education': return 'Educazione';
      default: return 'Generale';
    }
  };

  return (
    <div className={`rounded-lg p-4 shadow-sm border mb-3 transition-all duration-300 ${
      challenge.completed 
        ? 'bg-gradient-to-r from-savings-light to-green-50 border-savings shadow-md' 
        : 'bg-white border-gray-100 hover:shadow-md'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{challenge.badge}</span>
          <div>
            <h3 className={`font-semibold ${challenge.completed ? 'text-savings-dark' : 'text-gray-900'}`}>
              {challenge.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(challenge.category)}`}>
                {getCategoryLabel(challenge.category)}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {challenge.type}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          {challenge.completed ? (
            <div className="flex flex-col items-end">
              <span className="text-savings text-sm font-medium">Completata! ✅</span>
              <span className="text-xs text-savings-dark">+{challenge.xpReward} XP</span>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <span className="text-progress font-medium text-sm">+{challenge.xpReward} XP</span>
              <span className="text-xs text-gray-500">alla completamento</span>
            </div>
          )}
        </div>
      </div>
      
      <p className={`text-sm mb-3 ${challenge.completed ? 'text-savings-dark' : 'text-gray-600'}`}>
        {challenge.description}
      </p>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progresso</span>
          <span className={`font-medium ${challenge.completed ? 'text-savings' : 'text-progress'}`}>
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              challenge.completed 
                ? 'bg-gradient-to-r from-savings to-green-500' 
                : 'bg-gradient-to-r from-progress to-purple-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        
        {/* Dettaglio progresso */}
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>
            {challenge.current.toFixed(challenge.type === 'daily' && challenge.category === 'spending' ? 2 : 0)} / {challenge.target}
            {challenge.category === 'spending' || challenge.category === 'saving' ? ' €' : ''}
          </span>
          {!challenge.completed && (
            <span>
              {challenge.type === 'daily' ? 'Oggi' : 
               challenge.type === 'weekly' ? 'Questa settimana' : 
               'Questo mese'}
            </span>
          )}
        </div>
      </div>

      {/* Motivazione */}
      {!challenge.completed && progress > 50 && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-progress font-medium text-center">
            🎯 Ci sei quasi! Continua così per guadagnare {challenge.xpReward} XP!
          </p>
        </div>
      )}
    </div>
  );
};

export default ChallengeCard;
