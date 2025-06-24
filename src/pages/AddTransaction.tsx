
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinanceData } from '@/hooks/useFinanceData';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const AddTransaction = () => {
  const navigate = useNavigate();
  const { addTransaction } = useFinanceData();
  
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const expenseCategories = [
    'Alimentari', 'Trasporti', 'Casa', 'Svago', 'Salute', 'Shopping', 'Altro'
  ];
  
  const incomeCategories = [
    'Stipendio', 'Freelance', 'Investimenti', 'Regalo', 'Bonus', 'Altro'
  ];

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) return;

    addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      description: description || category,
      date
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    
    // Torna alla home
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-4 pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Aggiungi Transazione</h1>
          <p className="text-gray-600 mt-1">Registra una nuova spesa o entrata</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo di transazione */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                type === 'expense'
                  ? 'bg-expense text-white shadow-lg'
                  : 'bg-white text-expense border border-expense-light'
              }`}
            >
              💸 Spesa
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                type === 'income'
                  ? 'bg-savings text-white shadow-lg'
                  : 'bg-white text-savings border border-savings-light'
              }`}
            >
              📈 Entrata
            </button>
          </div>

          {/* Importo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Importo (€)
            </label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-lg"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    category === cat
                      ? `${type === 'expense' ? 'bg-expense text-white' : 'bg-savings text-white'}`
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {!categories.includes(category) && (
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Inserisci categoria personalizzata"
                className="mt-2"
              />
            )}
          </div>

          {/* Descrizione */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione (opzionale)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Aggiungi una nota..."
              rows={2}
            />
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Pulsante submit */}
          <Button
            type="submit"
            className={`w-full ${
              type === 'expense' 
                ? 'bg-expense hover:bg-expense-dark' 
                : 'bg-savings hover:bg-savings-dark'
            }`}
            disabled={!amount || !category}
          >
            {type === 'expense' ? '💸 Aggiungi Spesa' : '📈 Aggiungi Entrata'}
          </Button>
        </form>
      </div>
      
      <NavBar />
    </div>
  );
};

export default AddTransaction;
