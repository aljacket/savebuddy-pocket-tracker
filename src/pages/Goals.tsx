
import { useState } from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import NavBar from '@/components/NavBar';
import SavingsGoalCard from '@/components/SavingsGoalCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Goals = () => {
  const { savingsGoals, addSavingsGoal } = useFinanceData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    targetDate: '',
    category: 'Generale'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.targetAmount || !formData.targetDate) return;

    addSavingsGoal({
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      targetDate: formData.targetDate,
      category: formData.category
    });

    setFormData({
      title: '',
      targetAmount: '',
      targetDate: '',
      category: 'Generale'
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-4 pt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Obiettivi di Risparmio</h1>
            <p className="text-gray-600 mt-1">Definisci e raggiungi i tuoi obiettivi</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-savings hover:bg-savings-dark"
          >
            {showForm ? '✕' : '+ Nuovo'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Nuovo Obiettivo</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Nome obiettivo (es. Vacanze estive)"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              
              <Input
                type="number"
                step="0.01"
                placeholder="Importo target (€)"
                value={formData.targetAmount}
                onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                required
              />
              
              <Input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-savings hover:bg-savings-dark">
                  💰 Crea Obiettivo
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Annulla
                </Button>
              </div>
            </form>
          </div>
        )}

        {savingsGoals.length > 0 ? (
          <div>
            {savingsGoals.map(goal => (
              <SavingsGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-gray-600">Nessun obiettivo impostato</p>
            <p className="text-sm text-gray-500 mt-1">Crea il tuo primo obiettivo di risparmio!</p>
          </div>
        )}
      </div>
      
      <NavBar />
    </div>
  );
};

export default Goals;
