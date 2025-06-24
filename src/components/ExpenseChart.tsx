
import { Transaction } from '@/hooks/useFinanceData';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const ExpenseChart = ({ transactions }: ExpenseChartProps) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const dailyExpenses = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.toDateString() === date.toDateString() && t.type === 'expense';
    });
    
    return {
      date: date.toLocaleDateString('it-IT', { weekday: 'short' }),
      amount: dayTransactions.reduce((sum, t) => sum + t.amount, 0)
    };
  });

  const maxAmount = Math.max(...dailyExpenses.map(d => d.amount), 1);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Spese degli ultimi 7 giorni</h3>
      
      <div className="flex items-end justify-between h-32 gap-2">
        {dailyExpenses.map((day, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full flex flex-col items-center">
              <div 
                className="bg-expense rounded-t w-full min-h-[4px] transition-all duration-500"
                style={{ 
                  height: `${(day.amount / maxAmount) * 100}%`,
                  opacity: day.amount > 0 ? 1 : 0.3
                }}
              ></div>
              <span className="text-xs text-expense font-medium mt-1">
                €{day.amount.toFixed(0)}
              </span>
            </div>
            <span className="text-xs text-gray-500 mt-1">{day.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;
