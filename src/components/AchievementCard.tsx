import { Achievement } from '@/hooks/useFinanceData';

interface AchievementCardProps {
  achievement: Achievement;
  currentProgress?: number;
}

const AchievementCard = ({ achievement, currentProgress = 0 }: AchievementCardProps) => {
  const progress = Math.min((currentProgress / achievement.requirement.target) * 100, 100);
  const isCompleted = achievement.unlocked;

  return (
    <div className={`rounded-lg p-4 shadow-sm border mb-3 transition-all duration-300 ${
      isCompleted 
        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-md' 
        : 'bg-white border-gray-100 hover:shadow-md'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
            isCompleted 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' 
              : 'bg-gray-100'
          }`}>
            {achievement.badge}
          </div>
          <div>
            <h3 className={`font-semibold ${isCompleted ? 'text-orange-800' : 'text-gray-900'}`}>
              {achievement.title}
            </h3>
            <p className={`text-sm ${isCompleted ? 'text-orange-600' : 'text-gray-600'}`}>
              {achievement.description}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          {isCompleted ? (
            <div className="flex flex-col items-end">
              <span className="text-orange-500 text-sm font-medium">Sbloccato! ✨</span>
              <span className="text-xs text-orange-400">
                {achievement.unlockedDate && new Date(achievement.unlockedDate).toLocaleDateString('it-IT')}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <span className="text-gray-500 text-sm">{currentProgress}/{achievement.requirement.target}</span>
              <span className="text-xs text-progress font-medium">+{achievement.xpReward} XP</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Barra progresso solo se non completato */}
      {!isCompleted && (
        <div className="mb-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-progress to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">{progress.toFixed(1)}% completato</div>
        </div>
      )}

      {/* Ricompensa XP se completato */}
      {isCompleted && (
        <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-orange-200">
          <span className="text-orange-600 text-sm font-medium">
            🎯 Hai guadagnato {achievement.xpReward} XP!
          </span>
        </div>
      )}
    </div>
  );
};

export default AchievementCard; 