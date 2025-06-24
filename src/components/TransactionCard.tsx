
import { Transaction } from '@/hooks/useFinanceData';

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const isIncome = transaction.type === 'income';
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-lg ${isIncome ? 'text-savings' : 'text-expense'}`}>
              {isIncome ? '📈' : '💸'}
            </span>
            <span className="font-medium text-gray-900">{transaction.category}</span>
          </div>
          <p className="text-sm text-gray-600">{transaction.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(transaction.date).toLocaleDateString('it-IT')}
          </p>
        </div>
        <div className="text-right">
          <span className={`text-lg font-bold ${
            isIncome ? 'text-savings' : 'text-expense'
          }`}>
            {isIncome ? '+' : '-'}€{transaction.amount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
