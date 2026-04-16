import React, { useState, useMemo } from 'react';
import { Plus, Trash2, CreditCard as CardIcon, Calendar, CheckCircle2, ChevronRight, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, cn } from '../lib/utils';
import { CreditCard, Expense, Invoice } from '../types';

interface CardsProps {
  cards: CreditCard[];
  expenses: Expense[];
  invoices: Invoice[];
  onAddCard: (card: CreditCard) => void;
  onDeleteCard: (id: string) => void;
  onPayInvoice: (cardId: string, month: string) => void;
}

export function Cards({ cards, expenses, invoices, onAddCard, onDeleteCard, onPayInvoice }: CardsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreditCard>>({
    name: '',
    limit: 0,
    closingDay: 1,
    dueDay: 10,
    color: '#6366f1',
  });

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const cardStats = useMemo(() => {
    return cards.map(card => {
      const cardExpenses = expenses.filter(e => e.cardId === card.id);
      const currentInvoiceTotal = cardExpenses.reduce((sum, exp) => {
        if (exp.category === 'credit_one_time') return sum + exp.value;
        if (exp.category === 'credit_installments' && exp.totalInstallments) {
          return sum + (exp.value / exp.totalInstallments);
        }
        return sum;
      }, 0);

      const invoice = invoices.find(i => i.cardId === card.id && i.month === currentMonth);

      return {
        ...card,
        currentInvoiceTotal,
        availableLimit: card.limit - currentInvoiceTotal,
        isPaid: invoice?.isPaid || false,
        expenses: cardExpenses
      };
    });
  }, [cards, expenses, invoices, currentMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.limit) return;

    onAddCard({
      id: crypto.randomUUID(),
      name: formData.name,
      limit: Number(formData.limit),
      closingDay: Number(formData.closingDay),
      dueDay: Number(formData.dueDay),
      color: formData.color || '#6366f1',
    });

    setFormData({ name: '', limit: 0, closingDay: 1, dueDay: 10, color: '#6366f1' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 dark:text-white">
          <CardIcon size={18} className="text-accent" />
          Meus Cartões
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-accent text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 flex items-center gap-2 active:scale-95 transition-all"
        >
          <Plus size={16} />
          Novo Cartão
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-glass dark:bg-dark-glass backdrop-blur-md p-6 rounded-3xl border border-glass-border dark:border-dark-glass-border shadow-sm space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">Nome do Cartão</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/50 dark:bg-white/5 border border-glass-border dark:border-dark-glass-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white"
                    placeholder="Ex: Nubank, Inter..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">Limite Total (R$)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.limit || ''}
                    onChange={e => setFormData(prev => ({ ...prev, limit: Number(e.target.value) }))}
                    className="w-full bg-white/50 dark:bg-white/5 border border-glass-border dark:border-dark-glass-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">Dia Fechamento</label>
                  <input 
                    type="number" 
                    min="1" max="31"
                    value={formData.closingDay}
                    onChange={e => setFormData(prev => ({ ...prev, closingDay: Number(e.target.value) }))}
                    className="w-full bg-white/50 dark:bg-white/5 border border-glass-border dark:border-dark-glass-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">Dia Vencimento</label>
                  <input 
                    type="number" 
                    min="1" max="31"
                    value={formData.dueDay}
                    onChange={e => setFormData(prev => ({ ...prev, dueDay: Number(e.target.value) }))}
                    className="w-full bg-white/50 dark:bg-white/5 border border-glass-border dark:border-dark-glass-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">Cor</label>
                  <input 
                    type="color" 
                    value={formData.color}
                    onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-[46px] bg-white/50 dark:bg-white/5 border border-glass-border dark:border-dark-glass-border rounded-xl p-1 outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 text-xs font-black uppercase tracking-widest text-text-muted dark:text-gray-400 hover:text-text-main dark:hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-accent text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 active:scale-95 transition-all"
                >
                  Salvar Cartão
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardStats.map((card) => (
          <motion.div 
            key={card.id}
            layoutId={card.id}
            onClick={() => setSelectedCardId(selectedCardId === card.id ? null : card.id)}
            className="cursor-pointer group relative overflow-hidden bg-glass dark:bg-dark-glass backdrop-blur-md p-6 rounded-[2rem] border border-glass-border dark:border-dark-glass-border shadow-sm hover:shadow-xl transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent/10 transition-colors" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-8 rounded-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/5 flex items-center justify-center">
                <div className="w-4 h-3 bg-yellow-500/50 rounded-sm" />
              </div>
              <div className="flex items-center gap-2">
                {card.isPaid && <CheckCircle2 size={16} className="text-green-500" />}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCard(card.id);
                  }}
                  className="p-2 text-text-muted dark:text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <p className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">{card.name}</p>
              <h4 className="text-lg font-black dark:text-white">**** **** **** 4242</h4>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] font-black text-text-muted dark:text-gray-500 uppercase tracking-tighter">Fatura Atual</p>
                <p className="text-xl font-black text-accent">{formatCurrency(card.currentInvoiceTotal)}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-text-muted dark:text-gray-500 uppercase tracking-tighter">Limite Disp.</p>
                <p className="text-sm font-bold dark:text-gray-300">{formatCurrency(card.availableLimit)}</p>
              </div>
            </div>

            <div className="mt-6 h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-1000" 
                style={{ width: `${Math.min(100, (card.currentInvoiceTotal / card.limit) * 100)}%` }}
              />
            </div>

            <AnimatePresence>
              {selectedCardId === card.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-glass-border dark:border-dark-glass-border space-y-6"
                >
                  {/* Current Invoice */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[10px] font-black uppercase tracking-widest dark:text-white">Fatura de {new Date().toLocaleDateString('pt-BR', { month: 'long' })}</h5>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onPayInvoice(card.id, currentMonth);
                        }}
                        disabled={card.isPaid}
                        className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                          card.isPaid 
                            ? "bg-green-500/10 text-green-500 cursor-default" 
                            : "bg-accent text-white hover:opacity-90 active:scale-95"
                        )}
                      >
                        {card.isPaid ? 'Fatura Paga' : 'Pagar Fatura'}
                      </button>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                      {card.expenses.length > 0 ? card.expenses.map(exp => (
                        <div key={exp.id} className="flex items-center justify-between text-xs">
                          <span className="text-text-muted dark:text-gray-400 truncate pr-4">{exp.description}</span>
                          <span className="font-bold dark:text-white shrink-0">
                            {formatCurrency(exp.category === 'credit_installments' && exp.totalInstallments ? exp.value / exp.totalInstallments : exp.value)}
                          </span>
                        </div>
                      )) : (
                        <p className="text-[10px] text-text-muted dark:text-gray-500 italic">Nenhum gasto este mês</p>
                      )}
                    </div>
                  </div>

                  {/* Invoice History */}
                  <div className="space-y-3 pt-4 border-t border-glass-border/50 dark:border-dark-glass-border/50">
                    <h5 className="text-[10px] font-black uppercase tracking-widest dark:text-white">Histórico de Faturas</h5>
                    <div className="space-y-2">
                      {invoices.filter(i => i.cardId === card.id && i.month !== currentMonth).length > 0 ? (
                        invoices
                          .filter(i => i.cardId === card.id && i.month !== currentMonth)
                          .sort((a, b) => b.month.localeCompare(a.month))
                          .map(inv => (
                            <div key={inv.id} className="flex items-center justify-between p-2 bg-black/5 dark:bg-white/5 rounded-xl text-xs">
                              <span className="font-bold dark:text-gray-300 capitalize">
                                {new Date(inv.month + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase text-green-500">Paga</span>
                                <CheckCircle2 size={14} className="text-green-500" />
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-[10px] text-text-muted dark:text-gray-500 italic">Nenhuma fatura anterior registrada.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {cards.length === 0 && !isAdding && (
          <div className="col-span-full py-20 bg-glass dark:bg-dark-glass backdrop-blur-md rounded-[2rem] border border-dashed border-glass-border dark:border-dark-glass-border flex flex-col items-center justify-center text-text-muted dark:text-gray-500 space-y-4">
            <CardIcon size={48} className="opacity-10" />
            <p className="text-xs font-black uppercase tracking-widest italic">Nenhum cartão cadastrado</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="text-accent text-xs font-black uppercase tracking-widest hover:underline"
            >
              Adicionar meu primeiro cartão
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
