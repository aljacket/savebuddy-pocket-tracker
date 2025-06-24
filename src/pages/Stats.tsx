
import { useFinanceData } from '@/hooks/useFinanceData';
import ExpenseChart from '@/components/ExpenseChart';
import ChallengeCard from '@/components/ChallengeCard';

const Stats = () => {
  const { transactions, challenges, getMonthlyStats } = useFinanceData();
  const { totalIncome, totalExpenses } = getMonthlyStats();

  // Statistiche per categoria
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-4 pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Statistiche</h1>
          <p className="text-gray-600 mt-1">Analizza le tue abitudini finanziarie</p>
        </div>

        {/* Grafico spese settimanali */}
        <div className="mb-6">
          <ExpenseChart transactions={transactions} />
        </div>

        {/* Statistiche rapide */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Riepilogo Mensile</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Totale Entrate</span>
              <span className="font-semibold text-savings">+€{totalIncome.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Totale Spese</span>
              <span className="font-semibold text-expense">-€{totalExpenses.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-medium">Bilancio</span>
              <span className={`font-bold ${
                totalIncome - totalExpenses >= 0 ? 'text-savings' : 'text-expense'
              }`}>
                {totalIncome - totalExpenses >= 0 ? '+' : ''}€{(totalIncome - totalExpenses).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Spese per categoria */}
        {topCategories.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Spese per Categoria</h3>
            
            <div className="space-y-3">
              {topCategories.map(([category, amount]) => {
                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">{category}</span>
                      <span className="font-medium text-expense">€{amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-expense h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tutte le challenge */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Tutte le Challenge</h3>
          {challenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
