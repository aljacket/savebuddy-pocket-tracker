import { useFinanceData, Achievement } from '@/hooks/useFinanceData';
import AchievementCard from '@/components/AchievementCard';
import UserProfileCard from '@/components/UserProfileCard';

const Achievements = () => {
  const { 
    achievements, 
    userProfile, 
    userName, 
    transactions, 
    savingsGoals, 
    challenges 
  } = useFinanceData();

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  const completedChallenges = challenges.filter(c => c.completed).length;

  // Calcola progresso per ogni achievement
  const getAchievementProgress = (achievement: Achievement) => {
    switch (achievement.requirement.type) {
      case 'transactions':
        return transactions.length;
      case 'savings':
        return savingsGoals.length;
      case 'streak':
        return userProfile.streak;
      case 'challenges':
        return completedChallenges;
      default:
        return 0;
    }
  };

  // Statistiche generali
  const totalXpFromAchievements = unlockedAchievements.reduce((sum, a) => sum + a.xpReward, 0);
  const completionPercentage = (unlockedAchievements.length / achievements.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-4 pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Achievement 🏆</h1>
          <p className="text-gray-600 mt-1">
            {unlockedAchievements.length}/{achievements.length} sbloccati • {completionPercentage.toFixed(1)}% completato
          </p>
        </div>

        {/* Profilo utente */}
        <UserProfileCard 
          profile={userProfile}
          userName={userName}
          completedChallenges={completedChallenges}
          unlockedAchievements={unlockedAchievements.length}
        />

        {/* Statistiche achievements */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Statistiche Achievement</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{unlockedAchievements.length}</div>
              <div className="text-xs text-gray-600">Sbloccati</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-progress">{totalXpFromAchievements}</div>
              <div className="text-xs text-gray-600">XP da Achievement</div>
            </div>
          </div>

          {/* Barra progresso generale */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progresso generale</span>
              <span className="text-orange-500 font-medium">{completionPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Achievement sbloccati */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Achievement Sbloccati ✨</h2>
            {unlockedAchievements
              .sort((a, b) => new Date(b.unlockedDate || '').getTime() - new Date(a.unlockedDate || '').getTime())
              .map(achievement => (
                <AchievementCard 
                  key={achievement.id} 
                  achievement={achievement}
                  currentProgress={getAchievementProgress(achievement)}
                />
              ))}
          </div>
        )}

        {/* Achievement da sbloccare */}
        {lockedAchievements.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Da Sbloccare 🎯</h2>
            {lockedAchievements
              .sort((a, b) => {
                const progressA = getAchievementProgress(a) / a.requirement.target;
                const progressB = getAchievementProgress(b) / b.requirement.target;
                return progressB - progressA; // Ordina per progresso decrescente
              })
              .map(achievement => (
                <AchievementCard 
                  key={achievement.id} 
                  achievement={achievement}
                  currentProgress={getAchievementProgress(achievement)}
                />
              ))}
          </div>
        )}

        {/* Motivazione per continuare */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200 mb-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-semibold text-purple-800 mb-2">Continua così!</h3>
            <p className="text-sm text-purple-600 mb-3">
              Ogni transazione e obiettivo raggiunto ti avvicina al prossimo achievement!
            </p>
            
            {/* Prossimo achievement più vicino */}
            {lockedAchievements.length > 0 && (() => {
              const nextAchievement = lockedAchievements
                .map(a => ({
                  ...a,
                  progress: getAchievementProgress(a),
                  percentage: (getAchievementProgress(a) / a.requirement.target) * 100
                }))
                .sort((a, b) => b.percentage - a.percentage)[0];

              if (nextAchievement.percentage > 0) {
                return (
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-700">Prossimo:</span>
                      <span className="text-xs text-purple-600">{nextAchievement.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{nextAchievement.badge}</span>
                      <span className="text-sm font-medium text-gray-700">{nextAchievement.title}</span>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${nextAchievement.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 