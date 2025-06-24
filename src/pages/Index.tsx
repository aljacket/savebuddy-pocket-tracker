
import { useFinanceData } from '@/hooks/useFinanceData';
import TransactionCard from '@/components/TransactionCard';
import ChallengeCard from '@/components/ChallengeCard';
import NavBar from '@/components/NavBar';

const Index = () => {
  const { userName, getMonthlyStats, transactions, challenges } = useFinanceData();
  const { totalIncome, totalExpenses, balance } = getMonthlyStats();
  
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buongiorno';
    if (hour < 18) return 'Buon pomeriggio';
    return 'Buonasera';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-4 pt-8 pb-6">
        {/* Header con saluto */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Ecco il riepilogo delle tue finanze</p>
        </div>

        {/* Riepilogo mensile */}
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
        </div>

        {/* Challenge attive */}
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Challenge Attive 🎯</h2>
          {challenges.slice(0, 2).map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>

        {/* Transazioni recenti */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-900">Transazioni Recenti</h2>
            {transactions.length > 3 && (
              <span className="text-sm text-progress">Vedi tutte</span>
            )}
          </div>
          
          {recentTransactions.length > 0 ? (
            recentTransactions.map(transaction => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl mb-2">💸</div>
              <p className="text-gray-600">Nessuna transazione ancora</p>
              <p className="text-sm text-gray-500 mt-1">Inizia aggiungendo la tua prima spesa o entrata!</p>
            </div>
          )}
        </div>
      </div>
      
      <NavBar />
    </div>
  );
};

export default Index;
