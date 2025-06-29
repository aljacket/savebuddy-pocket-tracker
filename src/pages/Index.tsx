import { useFinanceData, Achievement } from '@/hooks/useFinanceData';
import TransactionCard from '@/components/TransactionCard';
import ChallengeCard from '@/components/ChallengeCard';
import UserProfileCard from '@/components/UserProfileCard';
import AchievementCard from '@/components/AchievementCard';

const Index = () => {
  const { 
    userName, 
    getMonthlyStats, 
    transactions, 
    challenges, 
    achievements, 
    userProfile,
    savingsGoals
  } = useFinanceData();
  
  const { totalIncome, totalExpenses, balance } = getMonthlyStats();
  
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const completedChallenges = challenges.filter(c => c.completed).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const recentAchievements = achievements
    .filter(a => a.unlocked)
    .sort((a, b) => new Date(b.unlockedDate || '').getTime() - new Date(a.unlockedDate || '').getTime())
    .slice(0, 2);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buongiorno';
    if (hour < 18) return 'Buon pomeriggio';
    return 'Buonasera';
  };

  // Calcola progresso achievements per display
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-4 pt-8 pb-6">
        {/* Header con saluto personalizzato */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Livello {userProfile.level} • {userProfile.streak} giorni di streak 🔥
          </p>
        </div>

        {/* Profilo Utente Gamificato */}
        <UserProfileCard 
          profile={userProfile}
          userName={userName}
          completedChallenges={completedChallenges}
          unlockedAchievements={unlockedAchievements}
        />

        {/* Riepilogo mensile migliorato */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Riepilogo Mensile</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-savings text-lg font-bold">
                +€{totalIncome.toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">Entrate</div>
            </div>
            
            <div className="text-center">
              <div className="text-expense text-lg font-bold">
                -€{totalExpenses.toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">Spese</div>
            </div>
            
            <div className="text-center">
              <div className={`text-lg font-bold ${
                balance >= 0 ? 'text-savings' : 'text-expense'
              }`}>
                €{balance.toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">Bilancio</div>
            </div>
          </div>

          {/* Progress bar per obiettivo mensile ipotetico */}
          {balance > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Obiettivo risparmio</span>
                <span className="text-savings font-medium">€{Math.min(balance, 500).toFixed(0)}/€500</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-savings to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((balance / 500) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Achievement recenti */}
        {recentAchievements.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Achievement Sbloccati 🏆</h2>
            {recentAchievements.map(achievement => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement}
              />
            ))}
          </div>
        )}

        {/* Challenge attive migliorate */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-900">Challenge Attive 🎯</h2>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>{completedChallenges}</span>
              <span>/</span>
              <span>{challenges.length}</span>
              <span>completate</span>
            </div>
          </div>
          {challenges.slice(0, 3).map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>

        {/* Transazioni recenti con XP info */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-900">Transazioni Recenti</h2>
            <div className="flex items-center gap-2">
              {transactions.length > 3 && (
                <span className="text-sm text-progress">Vedi tutte</span>
              )}
              <span className="text-xs text-gray-500">+5 XP per transazione</span>
            </div>
          </div>
          
          {recentTransactions.length > 0 ? (
            recentTransactions.map(transaction => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl mb-2">💸</div>
              <p className="text-gray-600">Nessuna transazione ancora</p>
              <p className="text-sm text-gray-500 mt-1">
                Inizia aggiungendo la tua prima spesa o entrata!
              </p>
              <p className="text-sm text-progress mt-2">
                🎯 Riceverai 15 XP per la prima transazione!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
